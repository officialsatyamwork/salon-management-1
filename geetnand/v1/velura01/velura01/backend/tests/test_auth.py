import pytest

from tests.conftest import API, PASSWORD, auth, last_token_from_email, register_owner

pytestmark = pytest.mark.asyncio(loop_scope="session")


async def test_register_creates_owner_tenant_and_first_salon(client):
    data = await register_owner(client)
    user = data["user"]
    assert user["role"] == "master_admin"
    assert user["tenant"]["name"] == "Glow Salon"
    assert user["tenant"]["trialEndsAt"]
    assert len(user["salons"]) == 1
    assert user["canViewRevenue"] is True
    assert "branches" in user["modules"]
    # Refresh token goes in an httpOnly cookie, never in the body.
    assert "refreshToken" not in data
    cookie = [h for h in client.cookies.jar][0]
    assert cookie.name == "velura_rt" and cookie.path == "/api/v1/auth"


async def test_register_rejects_duplicate_email_case_insensitive(client):
    await register_owner(client, email="dup@glow.in")
    r = await client.post(
        f"{API}/auth/register",
        json={
            "name": "X",
            "email": "DUP@glow.in",
            "phone": "9876500001",
            "businessName": "Other",
            "businessType": "Spa",
            "password": PASSWORD,
        },
    )
    assert r.status_code == 409
    assert r.json()["error"]["code"] == "email_taken"


async def test_register_validation_errors_are_field_level(client):
    r = await client.post(
        f"{API}/auth/register",
        json={
            "name": "",
            "email": "bad",
            "phone": "123",
            "businessName": "B",
            "businessType": "Salon",
            "password": "short",
        },
    )
    assert r.status_code == 422
    fields = {d["field"] for d in r.json()["error"]["details"]}
    assert {"name", "email", "phone", "password"} <= fields


async def test_login_with_phone(client):
    data = await register_owner(client, phone="9876512345")
    client.cookies.clear()
    r = await client.post(f"{API}/auth/login", json={"phone": "9876512345", "password": PASSWORD})
    assert r.status_code == 200
    assert r.json()["user"]["id"] == data["user"]["id"]
    missing = await client.post(f"{API}/auth/login", json={"phone": "9000000000", "password": PASSWORD})
    assert missing.status_code == 401 and missing.json()["error"]["code"] == "invalid_credentials"
    both = await client.post(
        f"{API}/auth/login", json={"email": "owner@glow.in", "phone": "9876512345", "password": PASSWORD}
    )
    assert both.status_code == 422
    neither = await client.post(f"{API}/auth/login", json={"password": PASSWORD})
    assert neither.status_code == 422


async def test_duplicate_phone_is_rejected(client):
    await register_owner(client, phone="9876522222")
    r = await client.post(
        f"{API}/auth/register",
        json={
            "name": "Other",
            "email": "other@glow.in",
            "phone": "9876522222",
            "businessName": "Other",
            "businessType": "Spa",
            "password": PASSWORD,
        },
    )
    assert r.status_code == 409
    assert r.json()["error"]["code"] == "phone_taken"


async def test_login_and_me(client):
    await register_owner(client)
    client.cookies.clear()
    r = await client.post(f"{API}/auth/login", json={"email": "OWNER@glow.in", "password": PASSWORD})
    assert r.status_code == 200
    token = r.json()["accessToken"]
    me = await client.get(f"{API}/auth/me", headers=auth(token))
    assert me.status_code == 200
    assert me.json()["email"] == "owner@glow.in"


async def test_login_wrong_password_and_unknown_email_look_the_same(client):
    await register_owner(client)
    a = await client.post(f"{API}/auth/login", json={"email": "owner@glow.in", "password": "wrong-pass"})
    b = await client.post(f"{API}/auth/login", json={"email": "nobody@glow.in", "password": "wrong-pass"})
    assert a.status_code == b.status_code == 401
    assert a.json() == b.json()


async def test_login_is_rate_limited(client):
    await register_owner(client)
    codes = [
        (await client.post(f"{API}/auth/login", json={"email": "owner@glow.in", "password": "nope-nope"})).status_code
        for _ in range(11)
    ]
    assert codes[-1] == 429


async def test_me_requires_valid_token(client):
    assert (await client.get(f"{API}/auth/me")).status_code == 401
    r = await client.get(f"{API}/auth/me", headers=auth("garbage"))
    assert r.status_code == 401 and r.json()["error"]["code"] == "invalid_token"


async def test_refresh_rotates_and_detects_reuse(client):
    await register_owner(client)
    old = client.cookies.get("velura_rt")
    r = await client.post(f"{API}/auth/refresh")
    assert r.status_code == 200 and r.json()["accessToken"]
    new = client.cookies.get("velura_rt")
    assert new and new != old

    # Replaying the old token revokes the whole session family...
    client.cookies.clear()
    client.cookies.set("velura_rt", old, path="/api/v1/auth")
    r = await client.post(f"{API}/auth/refresh")
    assert r.status_code == 401 and r.json()["error"]["code"] == "refresh_token_reused"
    # ...so the newer token stops working too.
    client.cookies.clear()
    client.cookies.set("velura_rt", new, path="/api/v1/auth")
    assert (await client.post(f"{API}/auth/refresh")).status_code == 401


async def test_logout_revokes_refresh_token(client):
    await register_owner(client)
    rt = client.cookies.get("velura_rt")
    assert (await client.post(f"{API}/auth/logout")).status_code == 200
    client.cookies.set("velura_rt", rt, path="/api/v1/auth")
    assert (await client.post(f"{API}/auth/refresh")).status_code == 401


async def test_change_password_invalidates_old_access_tokens(client):
    data = await register_owner(client)
    old_access = data["accessToken"]
    r = await client.post(
        f"{API}/auth/change-password",
        headers=auth(old_access),
        json={"currentPassword": PASSWORD, "newPassword": "An0ther-pass!"},
    )
    assert r.status_code == 200
    assert (await client.get(f"{API}/auth/me", headers=auth(old_access))).status_code == 401
    assert (await client.get(f"{API}/auth/me", headers=auth(r.json()["accessToken"]))).status_code == 200


async def test_change_password_needs_current_password(client):
    data = await register_owner(client)
    r = await client.post(
        f"{API}/auth/change-password",
        headers=auth(data["accessToken"]),
        json={"currentPassword": "not-it-123", "newPassword": "An0ther-pass!"},
    )
    assert r.status_code == 400 and r.json()["error"]["code"] == "invalid_password"


async def test_forgot_and_reset_password_flow(client):
    await register_owner(client)
    r = await client.post(f"{API}/auth/forgot-password", json={"email": "owner@glow.in"})
    assert r.status_code == 202
    token = last_token_from_email()
    r = await client.post(f"{API}/auth/reset-password", json={"token": token, "password": "Brand-new-pass1"})
    assert r.status_code == 200
    # Token is single use.
    r = await client.post(f"{API}/auth/reset-password", json={"token": token, "password": "Brand-new-pass2"})
    assert r.status_code == 400
    r = await client.post(f"{API}/auth/login", json={"email": "owner@glow.in", "password": "Brand-new-pass1"})
    assert r.status_code == 200


async def test_forgot_password_does_not_reveal_accounts(client):
    r = await client.post(f"{API}/auth/forgot-password", json={"email": "ghost@nowhere.in"})
    assert r.status_code == 202


async def test_customer_signup(client):
    r = await client.post(
        f"{API}/auth/register/customer",
        json={
            "name": "Priya",
            "email": "priya@example.com",
            "phone": "+91 98765 43210",
            "password": PASSWORD,
        },
    )
    assert r.status_code == 201
    u = r.json()["user"]
    assert u["role"] == "customer" and u["tenant"] is None and u["salons"] == []
    assert u["phone"] == "9876543210"
    assert u["canViewRevenue"] is False


async def test_health_and_security_headers(client):
    r = await client.get("/health")
    assert r.status_code == 200
    assert (await client.get("/ready")).json() == {"status": "ready"}
    r = await client.get(f"{API}/public/salons")
    assert r.headers["x-content-type-options"] == "nosniff"
    assert r.headers["x-request-id"]
    assert r.headers["cache-control"] == "no-store"


def test_settings_accept_comma_separated_cors(monkeypatch):
    from app.core.config import Settings

    monkeypatch.setenv("CORS_ORIGINS", "https://a.com, https://b.com")
    assert Settings().cors_origins == ["https://a.com", "https://b.com"]


def test_production_refuses_default_secret(monkeypatch):
    from pydantic import ValidationError

    from app.core.config import Settings

    monkeypatch.setenv("ENVIRONMENT", "production")
    monkeypatch.delenv("JWT_SECRET", raising=False)
    with pytest.raises(ValidationError):
        Settings(_env_file=None)
