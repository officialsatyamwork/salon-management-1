"""Role-aware dashboard.

V1 returns the real structure every later version fills in: the cards each
role sees, the module cards (with which release turns each on), and the
chart series. Figures that depend on bookings and billing are zero until
V2/V3 add those tables; revenue is never sent to managers or staff.
"""

import uuid
from datetime import UTC, datetime, timedelta

from fastapi import APIRouter, Query
from sqlalchemy import func, select

from app.api.deps import DB, CurrentUser
from app.models import Membership, Role, Salon, SalonStatus, User
from app.schemas import Card, DashboardOut, ModuleCard
from app.services.access import MODULES, RELEASED, accessible_salon_ids, can_view_revenue, ensure_salon_access, modules_for

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


def _module_cards(role: Role) -> list[ModuleCard]:
    out = []
    for key in modules_for(role):
        label, path, desc, release = MODULES[key]
        out.append(ModuleCard(key=key, label=label, path=path, description=desc, available=key in RELEASED, release=release))
    return out


async def _team_count(db: DB, salon_ids: list[uuid.UUID]) -> int:
    if not salon_ids:
        return 0
    return (
        await db.scalar(
            select(func.count(func.distinct(User.id)))
            .join(Membership, Membership.user_id == User.id)
            .where(Membership.salon_id.in_(salon_ids), User.role.in_([Role.manager, Role.staff]), User.is_active.is_(True))
        )
        or 0
    )


def _week_series() -> list[dict]:
    today = datetime.now(UTC).date()
    return [{"day": (today - timedelta(days=i)).strftime("%a"), "revenue": 0} for i in range(6, -1, -1)]


@router.get("", response_model=DashboardOut)
async def dashboard(user: CurrentUser, db: DB, salon_id: uuid.UUID | None = Query(None, alias="salonId")) -> DashboardOut:
    modules = _module_cards(user.role)

    if user.role == Role.customer:
        salons_open = await db.scalar(select(func.count()).select_from(Salon).where(Salon.status == SalonStatus.active)) or 0
        return DashboardOut(
            role=user.role,
            scope_label="My bookings",
            salon_id=None,
            modules=modules,
            cards=[
                Card(key="upcoming", label="Upcoming bookings", value=0),
                Card(key="visits", label="Past visits", value=0),
                Card(key="salons", label="Salons to book", value=salons_open),
            ],
            revenue_trend=None,
            top_services=[],
            today_appointments=[],
            upcoming=[],
        )

    if salon_id:
        salon = await ensure_salon_access(db, user, salon_id)
        scope_ids, scope_label = [salon.id], salon.name
    else:
        scope_ids = await accessible_salon_ids(db, user, include_inactive=False)
        scope_label = "All my salons" if len(scope_ids) != 1 else (await db.get(Salon, scope_ids[0])).name

    team = await _team_count(db, scope_ids)

    if user.role == Role.staff:
        cards = [
            Card(key="my_today", label="My appointments today", value=0),
            Card(key="commission", label="Commission this month", value=0, format="currency"),
            Card(key="next7", label="Next 7 days", value=0),
        ]
    elif user.role == Role.manager:
        cards = [
            Card(key="appointments_today", label="Appointments today", value=0),
            Card(key="walk_ins", label="Walk-ins today", value=0),
            Card(key="team", label="Team members", value=team),
            Card(key="customers_today", label="Customers served", value=0),
        ]
    else:
        cards = [
            Card(key="revenue_today", label="Today's revenue", value=0, format="currency"),
            Card(key="appointments_today", label="Appointments", value=0),
            Card(key="customers", label="Total customers", value=0),
            Card(key="pending_payments", label="Pending payments", value=0, format="currency"),
            Card(key="salons", label="Salons", value=len(scope_ids)),
            Card(key="team", label="Team members", value=team),
        ]

    return DashboardOut(
        role=user.role,
        scope_label=scope_label,
        salon_id=salon_id,
        cards=cards,
        modules=modules,
        revenue_trend=_week_series() if can_view_revenue(user) else None,
        top_services=[],
        today_appointments=[],
        upcoming=[],
    )
