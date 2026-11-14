"""Refresh-token rotation and one-time (reset / invite) tokens."""

import uuid
from datetime import UTC, datetime, timedelta

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.errors import AppError, Unauthorized
from app.core.security import hash_token, new_opaque_token
from app.models import OneTimeToken, RefreshToken, TokenPurpose, User


def _now() -> datetime:
    return datetime.now(UTC)


async def issue_refresh_token(
    db: AsyncSession, user: User, *, family_id: uuid.UUID | None = None, user_agent: str | None = None, ip: str | None = None
) -> str:
    raw = new_opaque_token()
    db.add(
        RefreshToken(
            user_id=user.id,
            token_hash=hash_token(raw),
            family_id=family_id or uuid.uuid4(),
            expires_at=_now() + timedelta(days=get_settings().refresh_token_ttl_days),
            user_agent=(user_agent or "")[:255] or None,
            ip=ip,
        )
    )
    await db.flush()
    return raw


async def rotate_refresh_token(
    db: AsyncSession, raw: str, *, user_agent: str | None = None, ip: str | None = None
) -> tuple[User, str]:
    """Swap a valid refresh token for a new one.

    If a token that was already rotated is presented again, someone may have
    stolen it: the whole family is revoked and the user must sign in again.
    """
    row = await db.scalar(select(RefreshToken).where(RefreshToken.token_hash == hash_token(raw)).with_for_update())
    if row is None:
        raise Unauthorized("Session expired, please sign in again", code="invalid_refresh_token")
    now = _now()
    if row.rotated_at is not None or row.revoked_at is not None:
        await revoke_family(db, row.family_id)
        raise Unauthorized("Session expired, please sign in again", code="refresh_token_reused")
    if row.expires_at <= now:
        raise Unauthorized("Session expired, please sign in again", code="refresh_token_expired")
    user = await db.get(User, row.user_id)
    if user is None or not user.is_active:
        await revoke_family(db, row.family_id)
        raise Unauthorized("Account is disabled", code="account_disabled")
    row.rotated_at = now
    new_raw = await issue_refresh_token(db, user, family_id=row.family_id, user_agent=user_agent, ip=ip)
    return user, new_raw


async def revoke_family(db: AsyncSession, family_id: uuid.UUID) -> None:
    await db.execute(
        update(RefreshToken)
        .where(RefreshToken.family_id == family_id, RefreshToken.revoked_at.is_(None))
        .values(revoked_at=_now())
    )


async def revoke_by_raw(db: AsyncSession, raw: str) -> None:
    row = await db.scalar(select(RefreshToken).where(RefreshToken.token_hash == hash_token(raw)))
    if row is not None:
        await revoke_family(db, row.family_id)


async def revoke_all_for_user(db: AsyncSession, user_id: uuid.UUID) -> None:
    await db.execute(
        update(RefreshToken).where(RefreshToken.user_id == user_id, RefreshToken.revoked_at.is_(None)).values(revoked_at=_now())
    )


async def issue_one_time_token(db: AsyncSession, user: User, purpose: TokenPurpose) -> str:
    s = get_settings()
    ttl = (
        timedelta(minutes=s.password_reset_ttl_minutes)
        if purpose == TokenPurpose.password_reset
        else timedelta(hours=s.invite_ttl_hours)
    )
    # Only the newest token of a purpose stays valid.
    await db.execute(
        update(OneTimeToken)
        .where(OneTimeToken.user_id == user.id, OneTimeToken.purpose == purpose, OneTimeToken.used_at.is_(None))
        .values(used_at=_now())
    )
    raw = new_opaque_token()
    db.add(OneTimeToken(user_id=user.id, purpose=purpose, token_hash=hash_token(raw), expires_at=_now() + ttl))
    await db.flush()
    return raw


async def consume_one_time_token(db: AsyncSession, raw: str, purpose: TokenPurpose) -> User:
    row = await db.scalar(
        select(OneTimeToken).where(OneTimeToken.token_hash == hash_token(raw), OneTimeToken.purpose == purpose).with_for_update()
    )
    if row is None or row.used_at is not None or row.expires_at <= _now():
        raise AppError("This link is invalid or has expired", code="invalid_token")
    user = await db.get(User, row.user_id)
    if user is None or not user.is_active:
        raise AppError("This link is invalid or has expired", code="invalid_token")
    row.used_at = _now()
    return user
