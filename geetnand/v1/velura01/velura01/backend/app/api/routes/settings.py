from fastapi import APIRouter, Request

from app.api.deps import DB, CurrentUser, client_ip
from app.core.errors import NotFound
from app.models import DEFAULT_NOTIFICATION_PREFS, Role, Tenant
from app.schemas import BusinessSettings, NotificationPrefs
from app.services.access import require_role
from app.services.audit import audit

router = APIRouter(prefix="/settings", tags=["settings"])


async def _tenant(db: DB, tenant_id) -> Tenant:
    t = await db.get(Tenant, tenant_id) if tenant_id else None
    if t is None:
        raise NotFound("Business not found")
    return t


def _business_out(t: Tenant) -> BusinessSettings:
    return BusinessSettings.model_construct(
        name=t.name,
        type=t.business_type,
        email=t.email,
        phone=t.phone,
        address=t.address,
        gst=t.gst_number,
        currency=t.currency,
        timezone=t.timezone,
    )


@router.get("/business", response_model=BusinessSettings)
async def get_business(user: CurrentUser, db: DB) -> BusinessSettings:
    require_role(user, Role.master_admin, Role.super_admin, Role.admin)
    return _business_out(await _tenant(db, user.tenant_id))


@router.put("/business", response_model=BusinessSettings)
async def update_business(body: BusinessSettings, user: CurrentUser, request: Request, db: DB) -> BusinessSettings:
    require_role(user, Role.master_admin)
    t = await _tenant(db, user.tenant_id)
    t.name, t.business_type, t.email, t.phone = body.name, body.type, body.email, body.phone
    t.address, t.gst_number, t.currency, t.timezone = body.address, body.gst, body.currency, body.timezone
    audit(db, actor=user, action="settings.business", target_type="tenant", target_id=t.id, ip=client_ip(request))
    return _business_out(t)


@router.get("/notifications", response_model=NotificationPrefs)
async def get_notifications(user: CurrentUser, db: DB) -> NotificationPrefs:
    require_role(user, Role.master_admin, Role.super_admin, Role.admin)
    t = await _tenant(db, user.tenant_id)
    return NotificationPrefs.model_validate({**DEFAULT_NOTIFICATION_PREFS, **(t.notification_prefs or {})})


@router.put("/notifications", response_model=NotificationPrefs)
async def update_notifications(body: NotificationPrefs, user: CurrentUser, request: Request, db: DB) -> NotificationPrefs:
    require_role(user, Role.master_admin, Role.super_admin, Role.admin)
    t = await _tenant(db, user.tenant_id)
    t.notification_prefs = body.model_dump(by_alias=True)
    audit(db, actor=user, action="settings.notifications", target_type="tenant", target_id=t.id, ip=client_ip(request))
    return body
