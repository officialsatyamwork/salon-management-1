"""Create a demo business with one user per role.

    python -m app.scripts.seed            # uses SEED_PASSWORD or the default below

Safe to run more than once: if the demo owner already exists, it only adds the employee account when that account is missing.
Do not run this against a production database.
"""

import asyncio
import os
from datetime import UTC, datetime, timedelta

from sqlalchemy import func, select

from app.core.config import get_settings
from app.core.security import hash_password
from app.db.session import dispose_engine, get_sessionmaker
from app.models import Membership, Role, Salon, Tenant, User

DEMO_PASSWORD = os.environ.get("SEED_PASSWORD", "Velura@123")


async def _ensure_demo_user(db, owner: User, *, email: str, name: str, role: Role, phone: str, title: str) -> None:
    """Add one demo account when an older seed ran before that role existed."""
    if await db.scalar(select(func.count()).select_from(User).where(User.email == email)):
        return
    salon = await db.scalar(
        select(Salon).where(Salon.tenant_id == owner.tenant_id, Salon.name == "Glow Salon - Andheri")
    )
    if salon is None or owner.tenant_id is None:
        return
    user = User(
        tenant_id=owner.tenant_id,
        email=email,
        full_name=name,
        role=role,
        job_title=title,
        password_hash=owner.password_hash,
        phone=phone,
    )
    db.add(user)
    await db.flush()
    db.add(Membership(user_id=user.id, salon_id=salon.id, granted_by_id=owner.id))
    print(f"Added {email} (same password as the other demo users)")


async def _ensure_employee(db, owner: User) -> None:
    """Add the receptionist if an older seed ran before the employee role existed."""
    await _ensure_demo_user(
        db, owner, email="employee@glowsalon.com", name="Neha Desai", role=Role.employee, phone="9876500013", title="Receptionist"
    )


async def main() -> None:
    if get_settings().is_production:
        raise SystemExit("Refusing to seed demo data in production")
    async with get_sessionmaker()() as db:
        owner_row = await db.scalar(select(User).where(User.email == "owner@glowsalon.com"))
        if owner_row:
            await _ensure_employee(db, owner_row)
            await _ensure_demo_user(
                db,
                owner_row,
                email="salonadmin@glowsalon.com",
                name="Meera Joshi",
                role=Role.admin,
                phone="9876500017",
                title="Salon Admin",
            )
            await db.commit()
            print("Demo data already present")
            return
        pw = hash_password(DEMO_PASSWORD)
        tenant = Tenant(
            name="Glow Salon",
            business_type="Salon",
            email="owner@glowsalon.com",
            phone="9876500000",
            address="12, Link Road, Andheri West, Mumbai",
            gst_number="27AABCU9603R1ZX",
            trial_ends_at=datetime.now(UTC) + timedelta(days=14),
        )
        db.add(tenant)
        await db.flush()
        andheri = Salon(
            tenant_id=tenant.id,
            name="Glow Salon - Andheri",
            city="Mumbai",
            address="12, Link Road, Andheri West",
            phone="9876500001",
        )
        bandra = Salon(
            tenant_id=tenant.id,
            name="Glow Salon - Bandra",
            city="Mumbai",
            address="45, Hill Road, Bandra West",
            phone="9876500002",
        )
        powai = Salon(
            tenant_id=tenant.id,
            name="Glow Salon - Powai",
            city="Mumbai",
            address="8, Hiranandani Gardens, Powai",
            phone="9876500003",
        )
        db.add_all([andheri, bandra, powai])
        await db.flush()

        def u(email, name, role, phone, title=None, tid=tenant.id):
            return User(
                tenant_id=tid, email=email, full_name=name, role=role, job_title=title, password_hash=pw, phone=phone
            )

        owner = u("owner@glowsalon.com", "Geeta Anand", Role.master_admin, "9876500010", "Owner")
        admin = u("admin@glowsalon.com", "Rahul Verma", Role.super_admin, "9876500011", "Area Admin")
        salon_admin = u("salonadmin@glowsalon.com", "Meera Joshi", Role.admin, "9876500017", "Salon Admin")
        manager = u("manager@glowsalon.com", "Sunita Iyer", Role.manager, "9876500012", "Branch Manager")
        employee = u("employee@glowsalon.com", "Neha Desai", Role.employee, "9876500013", "Receptionist")
        stylist = u("riya@glowsalon.com", "Riya Kapoor", Role.staff, "9876500014", "Senior Stylist")
        stylist2 = u("pooja@glowsalon.com", "Pooja Shah", Role.staff, "9876500015", "Nail Technician")
        customer = u("customer@example.com", "Priya Sharma", Role.customer, "9876500016", tid=None)
        db.add_all([owner, admin, salon_admin, manager, employee, stylist, stylist2, customer])
        await db.flush()
        db.add_all(
            [
                Membership(user_id=admin.id, salon_id=andheri.id, granted_by_id=owner.id),
                Membership(user_id=admin.id, salon_id=bandra.id, granted_by_id=owner.id),
                Membership(user_id=salon_admin.id, salon_id=andheri.id, granted_by_id=owner.id),
                Membership(user_id=manager.id, salon_id=andheri.id, granted_by_id=owner.id),
                Membership(user_id=employee.id, salon_id=andheri.id, granted_by_id=owner.id),
                Membership(user_id=stylist.id, salon_id=andheri.id, granted_by_id=owner.id),
                Membership(user_id=stylist2.id, salon_id=bandra.id, granted_by_id=owner.id),
            ]
        )
        await db.commit()
    await dispose_engine()
    print(f"Seeded demo business. Password for every demo user: {DEMO_PASSWORD}")
    for email, role in [
        ("owner@glowsalon.com", "master_admin"),
        ("admin@glowsalon.com", "super_admin (Andheri + Bandra)"),
        ("salonadmin@glowsalon.com", "admin (Andheri)"),
        ("manager@glowsalon.com", "manager (Andheri)"),
        ("employee@glowsalon.com", "employee (Andheri)"),
        ("riya@glowsalon.com", "staff (Andheri)"),
        ("customer@example.com", "customer"),
    ]:
        print(f"  {email:28} {role}")


if __name__ == "__main__":
    asyncio.run(main())
