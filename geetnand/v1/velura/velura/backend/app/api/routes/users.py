"""Team members (super_admins, managers, staff) and their salon access.

Who can do what:
- master_admin: manage any non-owner user in the business; grant/revoke salon access.
- super_admin:  manage managers and staff in salons they can access.
- manager:      read-only list of the team in their salon (staff allocation).
- staff/customer: no access.
"""

import uuid

from fastapi import APIRouter, Query, Request, status
from sqlalchemy import func, select

from app.api.deps import DB, CurrentUser, client_ip
from app.core.errors import AppError, Conflict, Forbidden, NotFound
from app.models import SINGLE_SALON_ROLES, Membership, Role, Salon, Tenant, TokenPurpose, User
from app.schemas import MessageOut, SalonIdsIn, UserCreateIn, UserList, UserOut, UserUpdateIn
from app.services import email as mailer
from app.services import tokens
from app.services.access import accessible_salon_ids, require_role
from app.services.audit import audit

router = APIRouter(prefix="/users", tags=["users"])


async def _salon_ids_of(db: DB, user_id: uuid.UUID) -> list[uuid.UUID]:
    return list((await db.scalars(select(Membership.salon_id).where(Membership.user_id == user_id))).all())


async def _to_out(db: DB, u: User) -> UserOut:
    return UserOut(
        id=u.id,
        email=u.email,
        full_name=u.full_name,
        phone=u.phone,
        role=u.role,
        job_title=u.job_title,
        is_active=u.is_active,
        invite_pending=u.password_hash is None,
        salon_ids=await _salon_ids_of(db, u.id),
        last_login_at=u.last_login_at,
        created_at=u.created_at,
    )


def _assignable_roles(actor: User) -> set[Role]:
    if actor.role == Role.master_admin:
        return {Role.super_admin, Role.manager, Role.staff}
    if actor.role == Role.super_admin:
        return {Role.manager, Role.staff}
    return set()


async def _check_salons(db: DB, actor: User, role: Role, salon_ids: list[uuid.UUID]) -> list[uuid.UUID]:
    salon_ids = list(dict.fromkeys(salon_ids))
    if role in SINGLE_SALON_ROLES and len(salon_ids) != 1:
        raise AppError(f"A {role.value} must belong to exactly one salon", code="one_salon_required")
    allowed = set(await accessible_salon_ids(db, actor))
    if not set(salon_ids) <= allowed:
        raise Forbidden("You can only assign salons you have access to")
    return salon_ids


async def _get_manageable(db: DB, actor: User, user_id: uuid.UUID) -> User:
    """Load a user the actor may change. Others look like 404."""
    target = await db.get(User, user_id)
    if target is None or target.tenant_id != actor.tenant_id or target.role == Role.customer:
        raise NotFound("User not found")
    if actor.role == Role.master_admin:
        if target.role == Role.master_admin and target.id != actor.id:
            raise NotFound("User not found")
        return target
    if actor.role == Role.super_admin:
        if target.role not in {Role.manager, Role.staff}:
            raise Forbidden("Only the owner can change this user")
        mine = set(await accessible_salon_ids(db, actor))
        if not set(await _salon_ids_of(db, target.id)) & mine:
            raise NotFound("User not found")
        return target
    raise Forbidden("You do not have permission to do this")


@router.get("", response_model=UserList)
async def list_users(
    actor: CurrentUser,
    db: DB,
    salon_id: uuid.UUID | None = Query(None, alias="salonId"),
    role: Role | None = None,
    q: str | None = Query(None, max_length=100),
    include_inactive: bool = Query(True, alias="includeInactive"),
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=100, alias="pageSize"),
) -> UserList:
    require_role(actor, Role.master_admin, Role.super_admin, Role.manager)
    stmt = select(User).where(User.tenant_id == actor.tenant_id, User.role != Role.customer)

    if actor.role != Role.master_admin:
        scope = await accessible_salon_ids(db, actor)
        stmt = stmt.where(User.id.in_(select(Membership.user_id).where(Membership.salon_id.in_(scope))))
        if actor.role == Role.manager:
            stmt = stmt.where(User.role.in_([Role.manager, Role.staff]))
        else:
            stmt = stmt.where(User.role.in_([Role.super_admin, Role.manager, Role.staff]))
    if salon_id:
        stmt = stmt.where(User.id.in_(select(Membership.user_id).where(Membership.salon_id == salon_id)))
    if role:
        stmt = stmt.where(User.role == role)
    if q:
        like = f"%{q.lower()}%"
        stmt = stmt.where(func.lower(User.full_name).like(like) | func.lower(User.email).like(like))
    if not include_inactive:
        stmt = stmt.where(User.is_active.is_(True))

    total = await db.scalar(select(func.count()).select_from(stmt.subquery())) or 0
    rows = (await db.scalars(stmt.order_by(User.created_at).offset((page - 1) * page_size).limit(page_size))).all()
    return UserList(items=[await _to_out(db, u) for u in rows], total=total, page=page, page_size=page_size)


@router.post("", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def create_user(body: UserCreateIn, actor: CurrentUser, request: Request, db: DB) -> UserOut:
    role = Role(body.role)
    if role not in _assignable_roles(actor):
        raise Forbidden("You cannot add a user with this role")
    salon_ids = await _check_salons(db, actor, role, body.salon_ids)
    if await db.scalar(select(func.count()).select_from(User).where(func.lower(User.email) == body.email)):
        raise Conflict("A user with this email already exists", code="email_taken")

    user = User(
        tenant_id=actor.tenant_id,
        email=body.email,
        phone=body.phone,
        full_name=body.full_name,
        role=role,
        job_title=body.job_title,
        password_hash=None,
    )
    db.add(user)
    await db.flush()
    db.add_all([Membership(user_id=user.id, salon_id=sid, granted_by_id=actor.id) for sid in salon_ids])
    raw = await tokens.issue_one_time_token(db, user, TokenPurpose.invite)
    audit(
        db,
        actor=actor,
        action="user.create",
        target_type="user",
        target_id=user.id,
        meta={"role": role.value, "salon_ids": [str(s) for s in salon_ids]},
        ip=client_ip(request),
    )
    tenant = await db.get(Tenant, actor.tenant_id)
    await db.commit()
    await mailer.send_invite(user.email, user.full_name, tenant.name if tenant else "Your salon", raw)
    return await _to_out(db, user)


@router.get("/{user_id}", response_model=UserOut)
async def get_user(user_id: uuid.UUID, actor: CurrentUser, db: DB) -> UserOut:
    if actor.id == user_id:
        return await _to_out(db, actor)
    return await _to_out(db, await _get_manageable(db, actor, user_id))


@router.patch("/{user_id}", response_model=UserOut)
async def update_user(user_id: uuid.UUID, body: UserUpdateIn, actor: CurrentUser, request: Request, db: DB) -> UserOut:
    target = actor if actor.id == user_id else await _get_manageable(db, actor, user_id)
    data = body.model_dump(exclude_unset=True)
    if "is_active" in data:
        if target.id == actor.id:
            raise AppError("You cannot deactivate your own account", code="self_deactivate")
        if target.is_active and not data["is_active"]:
            target.token_version += 1
            await tokens.revoke_all_for_user(db, target.id)
    for k, v in data.items():
        if k == "full_name" and v is None:
            continue
        setattr(target, k, v)
    audit(
        db,
        actor=actor,
        action="user.update",
        target_type="user",
        target_id=target.id,
        meta={k: v for k, v in data.items()},
        ip=client_ip(request),
    )
    await db.flush()
    return await _to_out(db, target)


@router.put("/{user_id}/salons", response_model=UserOut)
async def set_user_salons(user_id: uuid.UUID, body: SalonIdsIn, actor: CurrentUser, request: Request, db: DB) -> UserOut:
    """Replace a user's salon access (e.g. move a stylist to another branch)."""
    require_role(actor, Role.master_admin, Role.super_admin)
    target = await _get_manageable(db, actor, user_id)
    if target.role == Role.master_admin:
        raise AppError("The owner has access to every salon", code="owner_access")
    if target.role == Role.super_admin and actor.role != Role.master_admin:
        raise Forbidden("Only the owner can change an admin's salons")
    salon_ids = body.salon_ids
    if salon_ids or target.role in SINGLE_SALON_ROLES:
        new_ids = await _check_salons(db, actor, target.role, salon_ids)
    else:
        new_ids = []
    current = set(await _salon_ids_of(db, target.id))
    if actor.role == Role.super_admin:
        # A super_admin can only move people between salons they themselves manage.
        mine = set(await accessible_salon_ids(db, actor))
        if not current <= mine:
            raise Forbidden("This user also works in salons you don't manage")
    for sid in current - set(new_ids):
        m = await db.get(Membership, (target.id, sid))
        if m:
            await db.delete(m)
    for sid in set(new_ids) - current:
        db.add(Membership(user_id=target.id, salon_id=sid, granted_by_id=actor.id))
    audit(
        db,
        actor=actor,
        action="user.set_salons",
        target_type="user",
        target_id=target.id,
        meta={"from": [str(s) for s in current], "to": [str(s) for s in new_ids]},
        ip=client_ip(request),
    )
    await db.flush()
    return await _to_out(db, target)


@router.post("/{user_id}/salons/{salon_id}", response_model=UserOut)
async def grant_salon(user_id: uuid.UUID, salon_id: uuid.UUID, actor: CurrentUser, request: Request, db: DB) -> UserOut:
    """Owner grants a super_admin access to one more salon."""
    require_role(actor, Role.master_admin)
    target = await _get_manageable(db, actor, user_id)
    if target.role != Role.super_admin:
        raise AppError("Only admins can have several salons; use PUT /salons to move managers and staff", code="not_multi_salon")
    salon = await db.get(Salon, salon_id)
    if salon is None or salon.tenant_id != actor.tenant_id:
        raise NotFound("Salon not found")
    if await db.get(Membership, (target.id, salon_id)) is None:
        db.add(Membership(user_id=target.id, salon_id=salon_id, granted_by_id=actor.id))
        audit(
            db,
            actor=actor,
            action="access.grant",
            target_type="user",
            target_id=target.id,
            meta={"salon_id": str(salon_id)},
            ip=client_ip(request),
        )
        await db.flush()
    return await _to_out(db, target)


@router.delete("/{user_id}/salons/{salon_id}", response_model=UserOut)
async def revoke_salon(user_id: uuid.UUID, salon_id: uuid.UUID, actor: CurrentUser, request: Request, db: DB) -> UserOut:
    """Owner removes a super_admin's access to one salon without touching the others."""
    require_role(actor, Role.master_admin)
    target = await _get_manageable(db, actor, user_id)
    if target.role != Role.super_admin:
        raise AppError("Use PUT /salons to move managers and staff", code="not_multi_salon")
    m = await db.get(Membership, (target.id, salon_id))
    if m is not None:
        await db.delete(m)
        audit(
            db,
            actor=actor,
            action="access.revoke",
            target_type="user",
            target_id=target.id,
            meta={"salon_id": str(salon_id)},
            ip=client_ip(request),
        )
        await db.flush()
    return await _to_out(db, target)


@router.post("/{user_id}/resend-invite", response_model=MessageOut)
async def resend_invite(user_id: uuid.UUID, actor: CurrentUser, db: DB) -> MessageOut:
    target = await _get_manageable(db, actor, user_id)
    if target.password_hash is not None:
        raise AppError("This user has already accepted their invite", code="already_active")
    raw = await tokens.issue_one_time_token(db, target, TokenPurpose.invite)
    tenant = await db.get(Tenant, actor.tenant_id)
    await db.commit()
    await mailer.send_invite(target.email, target.full_name, tenant.name if tenant else "Your salon", raw)
    return MessageOut(message="Invite sent")
