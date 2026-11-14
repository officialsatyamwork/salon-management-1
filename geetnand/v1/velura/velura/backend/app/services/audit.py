import uuid
from typing import Any

from sqlalchemy.ext.asyncio import AsyncSession

from app.models import AuditLog, User


def audit(
    db: AsyncSession,
    *,
    actor: User | None,
    action: str,
    tenant_id: uuid.UUID | None = None,
    target_type: str | None = None,
    target_id: uuid.UUID | str | None = None,
    meta: dict[str, Any] | None = None,
    ip: str | None = None,
) -> None:
    """Queue an audit row in the current transaction."""
    db.add(
        AuditLog(
            tenant_id=tenant_id or (actor.tenant_id if actor else None),
            actor_id=actor.id if actor else None,
            action=action,
            target_type=target_type,
            target_id=str(target_id) if target_id else None,
            meta=meta,
            ip=ip,
        )
    )
