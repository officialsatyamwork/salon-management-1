import uuid

from fastapi import APIRouter, Query, Request, status
from sqlalchemy import func, select

from app.api.deps import DB, CurrentUser, client_ip
from app.core.errors import Forbidden
from app.models import TEAM_ROLES, Membership, Role, Salon, SalonStatus, Tenant, User
from app.schemas import PublicSalonOut, SalonCreateIn, SalonOut, SalonUpdateIn
from app.services.access import accessible_salon_ids, can_view_revenue, ensure_salon_access, require_role
from app.services.audit import audit

router = APIRouter(prefix="/salons", tags=["salons"])
public_router = APIRouter(prefix="/public", tags=["public"])


async def _staff_counts(db: DB, salon_ids: list[uuid.UUID]) -> dict[uuid.UUID, int]:
    if not salon_ids:
        return {}
    rows = await db.execute(
        select(Membership.salon_id, func.count())
        .join(User, User.id == Membership.user_id)
        .where(Membership.salon_id.in_(salon_ids), User.role.in_(TEAM_ROLES), User.is_active.is_(True))
        .group_by(Membership.salon_id)
    )
    return {sid: n for sid, n in rows.all()}


def _out(salon: Salon, staff: int, show_revenue: bool) -> SalonOut:
    return SalonOut(
        id=salon.id,
        name=salon.name,
        city=salon.city,
        address=salon.address,
        phone=salon.phone,
        status=salon.status,
        staff=staff,
        appointments=0,  # filled by the appointments module (V2)
        revenue=0.0 if show_revenue else None,  # filled by billing (V3); never sent to managers, employees or staff
        created_at=salon.created_at,
    )


@router.get("", response_model=list[SalonOut])
async def list_salons(user: CurrentUser, db: DB, include_inactive: bool = Query(True, alias="includeInactive")) -> list[SalonOut]:
    require_role(user, Role.master_admin, Role.super_admin, Role.admin, Role.manager, Role.employee, Role.staff)
    ids = await accessible_salon_ids(db, user, include_inactive=include_inactive)
    if not ids:
        return []
    salons = (await db.scalars(select(Salon).where(Salon.id.in_(ids)).order_by(Salon.created_at))).all()
    counts = await _staff_counts(db, ids)
    show = can_view_revenue(user)
    return [_out(s, counts.get(s.id, 0), show) for s in salons]


@router.post("", response_model=SalonOut, status_code=status.HTTP_201_CREATED)
async def create_salon(body: SalonCreateIn, user: CurrentUser, request: Request, db: DB) -> SalonOut:
    require_role(user, Role.master_admin)
    salon = Salon(tenant_id=user.tenant_id, **body.model_dump())
    db.add(salon)
    await db.flush()
    await db.refresh(salon)
    audit(db, actor=user, action="salon.create", target_type="salon", target_id=salon.id, ip=client_ip(request))
    return _out(salon, 0, True)


@router.get("/{salon_id}", response_model=SalonOut)
async def get_salon(salon_id: uuid.UUID, user: CurrentUser, db: DB) -> SalonOut:
    salon = await ensure_salon_access(db, user, salon_id)
    counts = await _staff_counts(db, [salon.id])
    return _out(salon, counts.get(salon.id, 0), can_view_revenue(user))


@router.patch("/{salon_id}", response_model=SalonOut)
async def update_salon(salon_id: uuid.UUID, body: SalonUpdateIn, user: CurrentUser, request: Request, db: DB) -> SalonOut:
    require_role(user, Role.master_admin, Role.super_admin, Role.admin)
    salon = await ensure_salon_access(db, user, salon_id)
    data = body.model_dump(exclude_unset=True)
    if "status" in data and user.role != Role.master_admin:
        raise Forbidden("Only the owner can open or close a salon")
    for k, v in data.items():
        if v is not None:
            setattr(salon, k, v)
    await db.flush()
    await db.refresh(salon)
    audit(
        db,
        actor=user,
        action="salon.update",
        target_type="salon",
        target_id=salon.id,
        meta={k: str(v) for k, v in data.items()},
        ip=client_ip(request),
    )
    counts = await _staff_counts(db, [salon.id])
    return _out(salon, counts.get(salon.id, 0), True)


@router.delete("/{salon_id}", status_code=status.HTTP_204_NO_CONTENT)
async def deactivate_salon(salon_id: uuid.UUID, user: CurrentUser, request: Request, db: DB) -> None:
    """Soft delete: the salon is marked inactive so its history is kept."""
    require_role(user, Role.master_admin)
    salon = await ensure_salon_access(db, user, salon_id)
    salon.status = SalonStatus.inactive
    audit(db, actor=user, action="salon.deactivate", target_type="salon", target_id=salon.id, ip=client_ip(request))


@public_router.get("/salons", response_model=list[PublicSalonOut])
async def public_salons(
    db: DB,
    city: str | None = Query(None, max_length=80),
    q: str | None = Query(None, max_length=100),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
) -> list[PublicSalonOut]:
    """Every active salon, for customers browsing where to book."""
    stmt = select(Salon, Tenant.name).join(Tenant, Tenant.id == Salon.tenant_id).where(Salon.status == SalonStatus.active)
    if city:
        stmt = stmt.where(func.lower(Salon.city) == city.lower())
    if q:
        like = f"%{q.lower()}%"
        stmt = stmt.where(func.lower(Salon.name).like(like) | func.lower(Tenant.name).like(like))
    rows = (await db.execute(stmt.order_by(Salon.name).offset(offset).limit(limit))).all()
    return [
        PublicSalonOut(id=s.id, name=s.name, city=s.city, address=s.address, phone=s.phone, business_name=tname)
        for s, tname in rows
    ]
