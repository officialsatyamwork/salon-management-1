import os

# Point at the test database before the app reads its settings.
os.environ.setdefault("DATABASE_URL", "postgresql+asyncpg://salon:salon@localhost:5432/salon_test")
os.environ["ENVIRONMENT"] = "test"
os.environ["REFRESH_COOKIE_SECURE"] = "false"  # the test client talks plain http
os.environ["EMAIL_BACKEND"] = "console"

import pytest  # noqa: E402
import pytest_asyncio  # noqa: E402
from httpx import ASGITransport, AsyncClient  # noqa: E402
from sqlalchemy import text  # noqa: E402

from app.api.routes.auth import login_limiter, sensitive_limiter  # noqa: E402
from app.db.session import dispose_engine, get_engine  # noqa: E402
from app.main import app  # noqa: E402
from app.models import Base  # noqa: E402
from app.services import email as mailer  # noqa: E402

API = "/api/v1"
PASSWORD = "Str0ng-pass!"


@pytest_asyncio.fixture(scope="session", loop_scope="session", autouse=True)
async def _schema():
    engine = get_engine()
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        for t in ("user_role", "salon_status", "token_purpose"):
            await conn.execute(text(f"DROP TYPE IF EXISTS {t} CASCADE"))
        await conn.run_sync(Base.metadata.create_all)
    yield
    await dispose_engine()


@pytest_asyncio.fixture(loop_scope="session", autouse=True)
async def _clean():
    yield
    async with get_engine().begin() as conn:
        tables = ", ".join(t.name for t in Base.metadata.sorted_tables)
        await conn.execute(text(f"TRUNCATE {tables} RESTART IDENTITY CASCADE"))
    login_limiter.reset()
    sensitive_limiter.reset()
    mailer.outbox.clear()


@pytest_asyncio.fixture(loop_scope="session")
async def client():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as c:
        yield c


async def register_owner(client: AsyncClient, email="owner@glow.in", business="Glow Salon") -> dict:
    r = await client.post(
        f"{API}/auth/register",
        json={
            "name": "Geeta",
            "email": email,
            "phone": "9876500000",
            "businessName": business,
            "businessType": "Salon",
            "password": PASSWORD,
        },
    )
    assert r.status_code == 201, r.text
    return r.json()


def auth(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


def last_token_from_email() -> str:
    body = mailer.outbox[-1].get_content()
    return body.split("token=")[1].split()[0]


async def invite_and_accept(client: AsyncClient, owner_token: str, *, email: str, role: str, salon_ids: list[str]) -> dict:
    r = await client.post(
        f"{API}/users",
        headers=auth(owner_token),
        json={
            "fullName": email.split("@")[0],
            "email": email,
            "role": role,
            "salonIds": salon_ids,
        },
    )
    assert r.status_code == 201, r.text
    token = last_token_from_email()
    r2 = await client.post(f"{API}/auth/accept-invite", json={"token": token, "password": PASSWORD})
    assert r2.status_code == 200, r2.text
    client.cookies.clear()
    return {"user": r.json(), "token": r2.json()["accessToken"]}


@pytest.fixture
def api():
    return API
