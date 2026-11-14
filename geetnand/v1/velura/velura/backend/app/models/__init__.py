"""Database models for V1: tenants, users, salons, memberships and auth tokens.

Access model (from the V1 spec):
- master_admin: owns a tenant (business) and sees every salon in it.
- super_admin:  sees only salons granted through `memberships`.
- manager:      exactly one salon via `memberships`; never receives revenue.
- staff:        exactly one salon via `memberships`; own work only.
- customer:     not tied to a tenant; browses every salon, sees own bookings.
"""

import enum
import uuid
from datetime import datetime

from sqlalchemy import (
    Boolean,
    DateTime,
    Enum,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
    func,
    text,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, Timestamps, UUIDPk


class Role(str, enum.Enum):
    master_admin = "master_admin"
    super_admin = "super_admin"
    manager = "manager"
    staff = "staff"
    customer = "customer"


# Roles that belong to a business (tenant) and are scoped to salons.
TENANT_ROLES = {Role.master_admin, Role.super_admin, Role.manager, Role.staff}
# Roles limited to exactly one salon.
SINGLE_SALON_ROLES = {Role.manager, Role.staff}
# Roles allowed to see revenue figures.
REVENUE_ROLES = {Role.master_admin, Role.super_admin}


class SalonStatus(str, enum.Enum):
    active = "active"
    inactive = "inactive"


class TokenPurpose(str, enum.Enum):
    password_reset = "password_reset"
    invite = "invite"


def _enum(e: type[enum.Enum], name: str) -> Enum:
    return Enum(e, name=name, values_callable=lambda x: [m.value for m in x], native_enum=True)


DEFAULT_NOTIFICATION_PREFS = {
    "appointmentReminders": True,
    "newBookings": True,
    "cancellations": True,
    "lowStock": True,
    "dailySummary": False,
    "weeklySummary": True,
}


class Tenant(UUIDPk, Timestamps, Base):
    """A business account. One master_admin owns it; it holds one or more salons."""

    __tablename__ = "tenants"

    name: Mapped[str] = mapped_column(String(160))
    business_type: Mapped[str] = mapped_column(String(60), default="Salon")
    email: Mapped[str | None] = mapped_column(String(254))
    phone: Mapped[str | None] = mapped_column(String(20))
    address: Mapped[str | None] = mapped_column(Text)
    gst_number: Mapped[str | None] = mapped_column(String(15))
    currency: Mapped[str] = mapped_column(String(3), default="INR")
    timezone: Mapped[str] = mapped_column(String(64), default="Asia/Kolkata")
    notification_prefs: Mapped[dict] = mapped_column(JSONB, default=lambda: dict(DEFAULT_NOTIFICATION_PREFS))
    trial_ends_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    salons: Mapped[list["Salon"]] = relationship(back_populates="tenant")


class User(UUIDPk, Timestamps, Base):
    __tablename__ = "users"
    __table_args__ = (
        # Case-insensitive unique email.
        Index("uq_users_email_lower", func.lower(text("email")), unique=True),
        Index("ix_users_tenant_role", "tenant_id", "role"),
    )

    tenant_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("tenants.id", ondelete="CASCADE"))
    email: Mapped[str] = mapped_column(String(254))
    phone: Mapped[str | None] = mapped_column(String(20))
    full_name: Mapped[str] = mapped_column(String(120))
    password_hash: Mapped[str | None] = mapped_column(String(255))  # null until an invite is accepted
    role: Mapped[Role] = mapped_column(_enum(Role, "user_role"))
    job_title: Mapped[str | None] = mapped_column(String(60))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    # Bumped on password change / forced logout; access tokens carrying an older value are rejected.
    token_version: Mapped[int] = mapped_column(Integer, default=0)
    last_login_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    tenant: Mapped[Tenant | None] = relationship()
    memberships: Mapped[list["Membership"]] = relationship(
        back_populates="user", cascade="all, delete-orphan", foreign_keys="Membership.user_id"
    )


class Salon(UUIDPk, Timestamps, Base):
    """A physical branch. Belongs to one tenant."""

    __tablename__ = "salons"
    __table_args__ = (Index("ix_salons_tenant_status", "tenant_id", "status"),)

    tenant_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("tenants.id", ondelete="CASCADE"))
    name: Mapped[str] = mapped_column(String(160))
    city: Mapped[str | None] = mapped_column(String(80))
    address: Mapped[str | None] = mapped_column(Text)
    phone: Mapped[str | None] = mapped_column(String(20))
    status: Mapped[SalonStatus] = mapped_column(_enum(SalonStatus, "salon_status"), default=SalonStatus.active)

    tenant: Mapped[Tenant] = relationship(back_populates="salons")


class Membership(Base):
    """Links admins, managers and staff to the salon(s) they may access."""

    __tablename__ = "memberships"

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    salon_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("salons.id", ondelete="CASCADE"), primary_key=True, index=True)
    granted_by_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    user: Mapped[User] = relationship(back_populates="memberships", foreign_keys=[user_id])
    salon: Mapped[Salon] = relationship()


class RefreshToken(UUIDPk, Base):
    """Rotating refresh tokens. Reuse of a rotated token revokes the whole family."""

    __tablename__ = "refresh_tokens"

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    token_hash: Mapped[str] = mapped_column(String(64), unique=True)
    family_id: Mapped[uuid.UUID] = mapped_column(index=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    revoked_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    rotated_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    user_agent: Mapped[str | None] = mapped_column(String(255))
    ip: Mapped[str | None] = mapped_column(String(64))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class OneTimeToken(UUIDPk, Base):
    """Password-reset and invite tokens. Single use, short-lived; only the hash is stored."""

    __tablename__ = "one_time_tokens"

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    purpose: Mapped[TokenPurpose] = mapped_column(_enum(TokenPurpose, "token_purpose"))
    token_hash: Mapped[str] = mapped_column(String(64), unique=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    used_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class AuditLog(UUIDPk, Base):
    """Who did what. Every access grant/revoke and user change is recorded."""

    __tablename__ = "audit_logs"
    __table_args__ = (Index("ix_audit_tenant_created", "tenant_id", "created_at"),)

    tenant_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("tenants.id", ondelete="CASCADE"))
    actor_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"))
    action: Mapped[str] = mapped_column(String(64))
    target_type: Mapped[str | None] = mapped_column(String(32))
    target_id: Mapped[str | None] = mapped_column(String(64))
    meta: Mapped[dict | None] = mapped_column(JSONB)
    ip: Mapped[str | None] = mapped_column(String(64))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


__all__ = [
    "AuditLog",
    "Base",
    "Membership",
    "OneTimeToken",
    "RefreshToken",
    "REVENUE_ROLES",
    "Role",
    "SINGLE_SALON_ROLES",
    "Salon",
    "SalonStatus",
    "TENANT_ROLES",
    "Tenant",
    "TokenPurpose",
    "User",
]
