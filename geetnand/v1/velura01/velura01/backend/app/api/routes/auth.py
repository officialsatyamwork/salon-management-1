from datetime import UTC, datetime, timedelta

from fastapi import APIRouter, Request, Response, status
from sqlalchemy import func, select

from app.api.deps import DB, CurrentUser, client_ip
from app.core.config import get_settings
from app.core.errors import AppError, Conflict, TooManyRequests, Unauthorized
from app.core.ratelimit import SlidingWindowLimiter
from app.core.security import create_access_token, hash_password, password_needs_rehash, verify_password
from app.models import Role, Salon, Tenant, TokenPurpose, User
from app.schemas import (
    ChangePasswordIn,
    ForgotPasswordIn,
    LoginIn,
    MeOut,
    MessageOut,
    RegisterBusinessIn,
    RegisterCustomerIn,
    ResetPasswordIn,
    SalonBrief,
    TenantBrief,
    TokenOut,
)
from app.services import email as mailer
from app.services import tokens
from app.services.access import accessible_salon_ids, can_view_revenue, ensure_phone_available, modules_for
from app.services.audit import audit

router = APIRouter(prefix="/auth", tags=["auth"])

_s = get_settings()
login_limiter = SlidingWindowLimiter(_s.login_rate_limit, _s.login_rate_window_seconds)
# Forgot-password and sign-up are cheap to abuse for spam, so they get their own budget.
sensitive_limiter = SlidingWindowLimiter(5, 300)


def _limit(limiter: SlidingWindowLimiter, key: str) -> None:
    ok, retry = limiter.hit(key)
    if not ok:
        raise TooManyRequests("Too many attempts. Please wait and try again.", details={"retry_after": retry})


async def _email_taken(db: DB, email: str) -> bool:
    return bool(await db.scalar(select(func.count()).select_from(User).where(func.lower(User.email) == email.lower())))


async def build_me(db: DB, user: User) -> MeOut:
    tenant = await db.get(Tenant, user.tenant_id) if user.tenant_id else None
    ids = await accessible_salon_ids(db, user)
    salons = (await db.scalars(select(Salon).where(Salon.id.in_(ids)).order_by(Salon.created_at))).all() if ids else []
    return MeOut(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        phone=user.phone,
        role=user.role,
        job_title=user.job_title,
        tenant=TenantBrief.model_validate(tenant) if tenant else None,
        salons=[SalonBrief.model_validate(s) for s in salons],
        modules=modules_for(user.role),
        can_view_revenue=can_view_revenue(user),
    )


def _set_refresh_cookie(response: Response, raw: str) -> None:
    s = get_settings()
    response.set_cookie(
        s.refresh_cookie_name,
        raw,
        max_age=s.refresh_token_ttl_days * 86400,
        httponly=True,
        secure=s.refresh_cookie_secure,
        samesite=s.refresh_cookie_samesite,
        domain=s.refresh_cookie_domain,
        path=f"{s.api_prefix}/auth",
    )


def _clear_refresh_cookie(response: Response) -> None:
    s = get_settings()
    response.delete_cookie(s.refresh_cookie_name, path=f"{s.api_prefix}/auth", domain=s.refresh_cookie_domain)


async def _session_response(db: DB, request: Request, response: Response, user: User, *, family=None) -> TokenOut:
    raw = await tokens.issue_refresh_token(
        db, user, family_id=family, user_agent=request.headers.get("user-agent"), ip=client_ip(request)
    )
    _set_refresh_cookie(response, raw)
    access, ttl = create_access_token(
        user_id=user.id, role=user.role.value, tenant_id=user.tenant_id, token_version=user.token_version
    )
    return TokenOut(access_token=access, expires_in=ttl, user=await build_me(db, user))


@router.post("/register", response_model=TokenOut, status_code=status.HTTP_201_CREATED)
async def register_business(body: RegisterBusinessIn, request: Request, response: Response, db: DB) -> TokenOut:
    """Business sign-up: creates the tenant, its first salon, and the master_admin owner."""
    _limit(sensitive_limiter, f"register:{client_ip(request)}")
    if await _email_taken(db, body.email):
        raise Conflict("An account with this email already exists", code="email_taken")
    await ensure_phone_available(db, body.phone)

    tenant = Tenant(
        name=body.business_name,
        business_type=body.business_type,
        email=body.email,
        phone=body.phone,
        trial_ends_at=datetime.now(UTC) + timedelta(days=get_settings().trial_days),
    )
    db.add(tenant)
    await db.flush()
    salon = Salon(tenant_id=tenant.id, name=body.business_name, phone=body.phone)
    owner = User(
        tenant_id=tenant.id,
        email=body.email,
        phone=body.phone,
        full_name=body.name,
        password_hash=hash_password(body.password),
        role=Role.master_admin,
        job_title="Owner",
        last_login_at=datetime.now(UTC),
    )
    db.add_all([salon, owner])
    await db.flush()
    audit(db, actor=owner, action="tenant.register", target_type="tenant", target_id=tenant.id, ip=client_ip(request))
    return await _session_response(db, request, response, owner)


@router.post("/register/customer", response_model=TokenOut, status_code=status.HTTP_201_CREATED)
async def register_customer(body: RegisterCustomerIn, request: Request, response: Response, db: DB) -> TokenOut:
    _limit(sensitive_limiter, f"register:{client_ip(request)}")
    if await _email_taken(db, body.email):
        raise Conflict("An account with this email already exists", code="email_taken")
    await ensure_phone_available(db, body.phone)
    user = User(
        email=body.email,
        phone=body.phone,
        full_name=body.name,
        password_hash=hash_password(body.password),
        role=Role.customer,
        last_login_at=datetime.now(UTC),
    )
    db.add(user)
    await db.flush()
    return await _session_response(db, request, response, user)


@router.post("/login", response_model=TokenOut)
async def login(body: LoginIn, request: Request, response: Response, db: DB) -> TokenOut:
    """Email or phone plus password. The message is the same when the account is missing."""
    ip = client_ip(request)
    ident = body.email or body.phone or ""
    _limit(login_limiter, f"login:{ip}:{ident}")
    if body.email:
        user = await db.scalar(select(User).where(func.lower(User.email) == body.email))
    else:
        user = await db.scalar(select(User).where(User.phone == body.phone))
    # verify_password runs a real hash check even when the user is missing (constant timing).
    if not verify_password(body.password, user.password_hash if user else None) or user is None:
        raise Unauthorized("Incorrect email or password", code="invalid_credentials")
    if not user.is_active:
        raise Unauthorized("This account has been disabled", code="account_disabled")
    if password_needs_rehash(user.password_hash):
        user.password_hash = hash_password(body.password)
    user.last_login_at = datetime.now(UTC)
    login_limiter.reset(f"login:{ip}:{ident}")
    audit(db, actor=user, action="auth.login", target_type="user", target_id=user.id, ip=ip)
    return await _session_response(db, request, response, user)


@router.post("/refresh", response_model=TokenOut)
async def refresh(request: Request, response: Response, db: DB) -> TokenOut:
    raw = request.cookies.get(get_settings().refresh_cookie_name)
    if not raw:
        raise Unauthorized("Not signed in", code="no_refresh_token")
    try:
        user, new_raw = await tokens.rotate_refresh_token(
            db, raw, user_agent=request.headers.get("user-agent"), ip=client_ip(request)
        )
    except Unauthorized:
        # Persist any family revocation before reporting the failure.
        await db.commit()
        _clear_refresh_cookie(response)
        raise
    _set_refresh_cookie(response, new_raw)
    access, ttl = create_access_token(
        user_id=user.id, role=user.role.value, tenant_id=user.tenant_id, token_version=user.token_version
    )
    return TokenOut(access_token=access, expires_in=ttl, user=await build_me(db, user))


@router.post("/logout", response_model=MessageOut)
async def logout(request: Request, response: Response, db: DB) -> MessageOut:
    raw = request.cookies.get(get_settings().refresh_cookie_name)
    if raw:
        await tokens.revoke_by_raw(db, raw)
    _clear_refresh_cookie(response)
    return MessageOut(message="Signed out")


@router.get("/me", response_model=MeOut)
async def me(user: CurrentUser, db: DB) -> MeOut:
    return await build_me(db, user)


@router.post("/change-password", response_model=TokenOut)
async def change_password(body: ChangePasswordIn, user: CurrentUser, request: Request, response: Response, db: DB) -> TokenOut:
    if not verify_password(body.current_password, user.password_hash):
        raise AppError("Current password is incorrect", code="invalid_password")
    if body.current_password == body.new_password:
        raise AppError("New password must be different", code="same_password")
    user.password_hash = hash_password(body.new_password)
    user.token_version += 1  # signs out every other device
    await tokens.revoke_all_for_user(db, user.id)
    audit(db, actor=user, action="auth.change_password", target_type="user", target_id=user.id, ip=client_ip(request))
    return await _session_response(db, request, response, user)


@router.post("/forgot-password", response_model=MessageOut, status_code=status.HTTP_202_ACCEPTED)
async def forgot_password(body: ForgotPasswordIn, request: Request, db: DB) -> MessageOut:
    _limit(sensitive_limiter, f"forgot:{client_ip(request)}")
    user = await db.scalar(select(User).where(func.lower(User.email) == body.email))
    if user and user.is_active and user.password_hash:
        raw = await tokens.issue_one_time_token(db, user, TokenPurpose.password_reset)
        await db.commit()
        await mailer.send_password_reset(user.email, user.full_name, raw)
    # Same answer whether or not the email exists, so accounts can't be discovered.
    return MessageOut(message="If an account exists for this email, a reset link has been sent")


@router.post("/reset-password", response_model=MessageOut)
async def reset_password(body: ResetPasswordIn, request: Request, db: DB) -> MessageOut:
    user = await tokens.consume_one_time_token(db, body.token, TokenPurpose.password_reset)
    user.password_hash = hash_password(body.password)
    user.token_version += 1
    await tokens.revoke_all_for_user(db, user.id)
    audit(db, actor=user, action="auth.reset_password", target_type="user", target_id=user.id, ip=client_ip(request))
    return MessageOut(message="Password updated. You can sign in now.")


@router.post("/accept-invite", response_model=TokenOut)
async def accept_invite(body: ResetPasswordIn, request: Request, response: Response, db: DB) -> TokenOut:
    user = await tokens.consume_one_time_token(db, body.token, TokenPurpose.invite)
    user.password_hash = hash_password(body.password)
    user.last_login_at = datetime.now(UTC)
    audit(db, actor=user, action="auth.accept_invite", target_type="user", target_id=user.id, ip=client_ip(request))
    return await _session_response(db, request, response, user)
