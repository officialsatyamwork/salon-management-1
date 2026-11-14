"""Who can reach which salons, and which modules each role sees.

Every endpoint that returns salon data goes through `accessible_salon_ids` /
`ensure_salon_access`, so the rules live in one place and are enforced in the
API rather than in the UI.
"""

import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.errors import Conflict, Forbidden, NotFound
from app.models import REVENUE_ROLES, Membership, Role, Salon, SalonStatus, User

# Module key -> (label, path, description, release)
MODULES: dict[str, tuple[str, str, str, str]] = {
    "dashboard": ("Dashboard", "/dashboard", "Today at a glance", "V1"),
    "appointments": ("Appointments", "/dashboard/appointments", "Bookings and live calendar", "V2"),
    "customers": ("Customers", "/dashboard/customers", "Profiles, history and notes", "V2"),
    "billing": ("Billing & POS", "/dashboard/billing", "GST invoices and payments", "V3"),
    "staff": ("Staff", "/dashboard/staff", "Profiles, shifts and commission", "V2"),
    "services": ("Services", "/dashboard/services", "Service catalogue and pricing", "V2"),
    "inventory": ("Inventory", "/dashboard/inventory", "Products and stock", "V3"),
    "membership": ("Membership", "/dashboard/membership", "Memberships, packages, loyalty", "V2"),
    "marketing": ("Marketing", "/dashboard/marketing", "WhatsApp reminders and campaigns", "V3"),
    "reports": ("Reports", "/dashboard/reports", "Sales, staff and customer reports", "V3"),
    "branches": ("Branches", "/dashboard/branches", "Salons and access", "V1"),
    "settings": ("Settings", "/dashboard/settings", "Business profile and security", "V1"),
}

# Modules live in the current release.
RELEASED = {"dashboard", "branches", "settings"}

ROLE_MODULES: dict[Role, list[str]] = {
    Role.master_admin: list(MODULES),
    Role.super_admin: list(MODULES),
    # One salon, full desk. Creating branches stays with the master admin.
    Role.admin: [key for key in MODULES if key != "branches"],
    Role.manager: ["dashboard", "appointments", "customers", "staff", "services", "inventory", "settings"],
    # Front desk: today's book and the customer list. No billing, reports, or revenue.
    Role.employee: ["dashboard", "appointments", "customers", "settings"],
    Role.staff: ["dashboard", "appointments", "settings"],
    Role.customer: ["dashboard", "appointments", "settings"],
}


def modules_for(role: Role) -> list[str]:
    return ROLE_MODULES[role]


def can_view_revenue(user: User) -> bool:
    return user.role in REVENUE_ROLES


async def accessible_salon_ids(db: AsyncSession, user: User, *, include_inactive: bool = True) -> list[uuid.UUID]:
    """Salon ids this user may read. Customers get none here (they use the public listing)."""
    if user.role == Role.customer or user.tenant_id is None:
        return []
    q = select(Salon.id).where(Salon.tenant_id == user.tenant_id)
    if user.role != Role.master_admin:
        q = q.join(Membership, Membership.salon_id == Salon.id).where(Membership.user_id == user.id)
    if not include_inactive:
        q = q.where(Salon.status == SalonStatus.active)
    return list((await db.scalars(q.order_by(Salon.created_at))).all())


async def ensure_salon_access(db: AsyncSession, user: User, salon_id: uuid.UUID) -> Salon:
    """Return the salon if the user may access it. Unknown and forbidden look the same (404)."""
    salon = await db.get(Salon, salon_id)
    if salon is None or salon.tenant_id != user.tenant_id:
        raise NotFound("Salon not found")
    if user.role == Role.master_admin:
        return salon
    member = await db.get(Membership, (user.id, salon_id))
    if member is None:
        raise NotFound("Salon not found")
    return salon


def require_role(user: User, *roles: Role) -> None:
    if user.role not in roles:
        raise Forbidden("You do not have permission to do this")


async def ensure_phone_available(
    db: AsyncSession, phone: str | None, *, except_user_id: uuid.UUID | None = None
) -> None:
    """A phone number identifies one account, so login by phone is unambiguous."""
    if not phone:
        return
    q = select(User.id).where(User.phone == phone)
    if except_user_id is not None:
        q = q.where(User.id != except_user_id)
    if await db.scalar(q):
        raise Conflict("An account with this phone number already exists", code="phone_taken")
