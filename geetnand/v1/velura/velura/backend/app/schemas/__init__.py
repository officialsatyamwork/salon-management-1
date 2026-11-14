"""Request/response schemas. JSON uses camelCase to match the React frontend."""

import re
import uuid
from datetime import datetime
from typing import Annotated, Literal

from pydantic import AfterValidator, BaseModel, ConfigDict, EmailStr, Field, StringConstraints
from pydantic.alias_generators import to_camel

from app.models import Role, SalonStatus


class Camel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)


def _phone(v: str | None) -> str | None:
    if v is None or v == "":
        return None
    digits = re.sub(r"[\s-]", "", v)
    if digits.startswith("+91"):
        digits = digits[3:]
    if not re.fullmatch(r"\d{10}", digits):
        raise ValueError("Enter a valid 10-digit phone number")
    return digits


def _gst(v: str | None) -> str | None:
    if v is None or v.strip() == "":
        return None
    v = v.strip().upper()
    if not re.fullmatch(r"\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]", v):
        raise ValueError("Enter a valid 15-character GSTIN")
    return v


def _lower_email(v: str) -> str:
    return v.strip().lower()


Phone = Annotated[str, AfterValidator(_phone)]
OptPhone = Annotated[str | None, AfterValidator(_phone)]
Email = Annotated[EmailStr, AfterValidator(_lower_email)]
Name = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=120)]
Password = Annotated[str, StringConstraints(min_length=8, max_length=128)]


# ---------- Auth ----------


class RegisterBusinessIn(Camel):
    name: Name
    email: Email
    phone: Phone
    business_name: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=160)]
    business_type: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=60)]
    password: Password


class RegisterCustomerIn(Camel):
    name: Name
    email: Email
    phone: Phone
    password: Password


class LoginIn(Camel):
    email: Email
    password: Annotated[str, StringConstraints(min_length=1, max_length=128)]


class ForgotPasswordIn(Camel):
    email: Email


class ResetPasswordIn(Camel):
    token: Annotated[str, StringConstraints(min_length=20, max_length=200)]
    password: Password


class ChangePasswordIn(Camel):
    current_password: Annotated[str, StringConstraints(min_length=1, max_length=128)]
    new_password: Password


class TenantBrief(Camel):
    id: uuid.UUID
    name: str
    business_type: str
    trial_ends_at: datetime | None = None


class SalonBrief(Camel):
    id: uuid.UUID
    name: str
    city: str | None = None
    status: SalonStatus


class MeOut(Camel):
    id: uuid.UUID
    email: str
    full_name: str
    phone: str | None
    role: Role
    job_title: str | None
    tenant: TenantBrief | None
    salons: list[SalonBrief]
    modules: list[str]
    can_view_revenue: bool


class TokenOut(Camel):
    access_token: str
    token_type: Literal["bearer"] = "bearer"
    expires_in: int
    user: MeOut


class MessageOut(Camel):
    message: str


# ---------- Users ----------

AssignableRole = Literal["super_admin", "manager", "staff"]


class UserCreateIn(Camel):
    full_name: Name
    email: Email
    phone: OptPhone = None
    role: AssignableRole
    job_title: Annotated[str | None, StringConstraints(strip_whitespace=True, max_length=60)] = None
    salon_ids: list[uuid.UUID] = Field(min_length=1, max_length=200)


class UserUpdateIn(Camel):
    full_name: Name | None = None
    phone: OptPhone = None
    job_title: Annotated[str | None, StringConstraints(strip_whitespace=True, max_length=60)] = None
    is_active: bool | None = None


class SalonIdsIn(Camel):
    salon_ids: list[uuid.UUID] = Field(max_length=200)


class UserOut(Camel):
    id: uuid.UUID
    email: str
    full_name: str
    phone: str | None
    role: Role
    job_title: str | None
    is_active: bool
    invite_pending: bool
    salon_ids: list[uuid.UUID]
    last_login_at: datetime | None
    created_at: datetime


class UserList(Camel):
    items: list[UserOut]
    total: int
    page: int
    page_size: int


# ---------- Salons ----------


class SalonCreateIn(Camel):
    name: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=160)]
    city: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=80)]
    address: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=500)]
    phone: Phone


class SalonUpdateIn(Camel):
    name: Annotated[str | None, StringConstraints(strip_whitespace=True, min_length=1, max_length=160)] = None
    city: Annotated[str | None, StringConstraints(strip_whitespace=True, min_length=1, max_length=80)] = None
    address: Annotated[str | None, StringConstraints(strip_whitespace=True, min_length=1, max_length=500)] = None
    phone: OptPhone = None
    status: SalonStatus | None = None


class SalonOut(Camel):
    id: uuid.UUID
    name: str
    city: str | None
    address: str | None
    phone: str | None
    status: SalonStatus
    staff: int = 0
    appointments: int = 0
    # Null for roles that may not see revenue (manager, staff).
    revenue: float | None = None
    created_at: datetime


class PublicSalonOut(Camel):
    id: uuid.UUID
    name: str
    city: str | None
    address: str | None
    phone: str | None
    business_name: str


# ---------- Settings ----------


class BusinessSettings(Camel):
    name: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=160)]
    type: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=60)]
    email: Email | None = None
    phone: OptPhone = None
    address: Annotated[str | None, StringConstraints(strip_whitespace=True, max_length=500)] = None
    gst: Annotated[str | None, AfterValidator(_gst)] = None
    currency: Annotated[str, StringConstraints(strip_whitespace=True, to_upper=True, pattern=r"^[A-Za-z]{3}$")] = "INR"
    timezone: Annotated[str, StringConstraints(strip_whitespace=True, max_length=64)] = "Asia/Kolkata"


class NotificationPrefs(Camel):
    appointment_reminders: bool = True
    new_bookings: bool = True
    cancellations: bool = True
    low_stock: bool = True
    daily_summary: bool = False
    weekly_summary: bool = True


# ---------- Dashboard ----------


class Card(Camel):
    key: str
    label: str
    value: float | int | None
    format: Literal["currency", "number", "text"] = "number"
    hint: str | None = None


class ModuleCard(Camel):
    key: str
    label: str
    path: str
    description: str
    available: bool
    release: str


class DashboardOut(Camel):
    role: Role
    scope_label: str
    salon_id: uuid.UUID | None
    cards: list[Card]
    modules: list[ModuleCard]
    revenue_trend: list[dict] | None
    top_services: list[dict]
    today_appointments: list[dict]
    upcoming: list[dict]
