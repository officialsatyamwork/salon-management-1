"""The V1 access model: salon scoping per role, enforced in the API."""

import pytest

from tests.conftest import API, PASSWORD, auth, invite_and_accept, last_token_from_email, register_owner

pytestmark = pytest.mark.asyncio(loop_scope="session")


async def _setup(client):
    """Owner with three salons, an admin on A+B, a manager on A, a stylist on A."""
    owner = await register_owner(client)
    ot = owner["accessToken"]
    a = owner["user"]["salons"][0]["id"]
    b = (
        await client.post(
            f"{API}/salons", headers=auth(ot), json={"name": "B", "city": "Pune", "address": "x", "phone": "9876500002"}
        )
    ).json()["id"]
    c = (
        await client.post(
            f"{API}/salons", headers=auth(ot), json={"name": "C", "city": "Pune", "address": "y", "phone": "9876500003"}
        )
    ).json()["id"]
    client.cookies.clear()
    admin = await invite_and_accept(client, ot, email="admin@glow.in", role="super_admin", salon_ids=[a, b])
    manager = await invite_and_accept(client, ot, email="mgr@glow.in", role="manager", salon_ids=[a])
    staff = await invite_and_accept(client, ot, email="riya@glow.in", role="staff", salon_ids=[a])
    return {"ot": ot, "a": a, "b": b, "c": c, "admin": admin, "manager": manager, "staff": staff}


async def test_each_role_sees_only_its_salons(client):
    s = await _setup(client)
    ids = lambda r: {x["id"] for x in r.json()}  # noqa: E731
    assert ids(await client.get(f"{API}/salons", headers=auth(s["ot"]))) == {s["a"], s["b"], s["c"]}
    assert ids(await client.get(f"{API}/salons", headers=auth(s["admin"]["token"]))) == {s["a"], s["b"]}
    assert ids(await client.get(f"{API}/salons", headers=auth(s["manager"]["token"]))) == {s["a"]}
    assert ids(await client.get(f"{API}/salons", headers=auth(s["staff"]["token"]))) == {s["a"]}


async def test_admin_cannot_open_unassigned_salon(client):
    s = await _setup(client)
    r = await client.get(f"{API}/salons/{s['c']}", headers=auth(s["admin"]["token"]))
    assert r.status_code == 404
    r = await client.get(f"{API}/dashboard", params={"salonId": s["c"]}, headers=auth(s["admin"]["token"]))
    assert r.status_code == 404


async def test_manager_never_receives_revenue(client):
    s = await _setup(client)
    mt = s["manager"]["token"]
    salons = (await client.get(f"{API}/salons", headers=auth(mt))).json()
    assert all(x["revenue"] is None for x in salons)
    dash = (await client.get(f"{API}/dashboard", headers=auth(mt))).json()
    assert dash["revenueTrend"] is None
    assert not any(c["format"] == "currency" for c in dash["cards"])
    assert "billing" not in [m["key"] for m in dash["modules"]]
    me = (await client.get(f"{API}/auth/me", headers=auth(mt))).json()
    assert me["canViewRevenue"] is False
    # Owner does get revenue.
    owner_salons = (await client.get(f"{API}/salons", headers=auth(s["ot"]))).json()
    assert all(x["revenue"] is not None for x in owner_salons)


async def test_owner_grants_and_revokes_admin_salon_access(client):
    s = await _setup(client)
    admin_id = s["admin"]["user"]["id"]
    at = s["admin"]["token"]

    r = await client.post(f"{API}/users/{admin_id}/salons/{s['c']}", headers=auth(s["ot"]))
    assert r.status_code == 200 and s["c"] in r.json()["salonIds"]
    assert (await client.get(f"{API}/salons/{s['c']}", headers=auth(at))).status_code == 200

    # Revoking one salon leaves the others untouched.
    r = await client.delete(f"{API}/users/{admin_id}/salons/{s['b']}", headers=auth(s["ot"]))
    assert set(r.json()["salonIds"]) == {s["a"], s["c"]}
    assert (await client.get(f"{API}/salons/{s['b']}", headers=auth(at))).status_code == 404
    assert (await client.get(f"{API}/salons/{s['a']}", headers=auth(at))).status_code == 200


async def test_only_owner_can_grant_access(client):
    s = await _setup(client)
    r = await client.post(f"{API}/users/{s['admin']['user']['id']}/salons/{s['c']}", headers=auth(s["admin"]["token"]))
    assert r.status_code == 403


async def test_manager_and_staff_must_have_exactly_one_salon(client):
    s = await _setup(client)
    r = await client.post(
        f"{API}/users",
        headers=auth(s["ot"]),
        json={
            "fullName": "Two",
            "email": "two@glow.in",
            "role": "staff",
            "salonIds": [s["a"], s["b"]],
        },
    )
    assert r.status_code == 400 and r.json()["error"]["code"] == "one_salon_required"


async def test_admin_can_add_staff_only_to_own_salons(client):
    s = await _setup(client)
    at = s["admin"]["token"]
    ok = await client.post(
        f"{API}/users", headers=auth(at), json={"fullName": "N", "email": "n@glow.in", "role": "staff", "salonIds": [s["b"]]}
    )
    assert ok.status_code == 201
    bad = await client.post(
        f"{API}/users", headers=auth(at), json={"fullName": "M", "email": "m@glow.in", "role": "staff", "salonIds": [s["c"]]}
    )
    assert bad.status_code == 403
    # And may not create other admins.
    r = await client.post(
        f"{API}/users",
        headers=auth(at),
        json={"fullName": "S", "email": "s@glow.in", "role": "super_admin", "salonIds": [s["a"]]},
    )
    assert r.status_code == 403


async def test_staff_cannot_manage_team_or_settings(client):
    s = await _setup(client)
    st = s["staff"]["token"]
    assert (await client.get(f"{API}/users", headers=auth(st))).status_code == 403
    assert (await client.get(f"{API}/settings/business", headers=auth(st))).status_code == 403
    assert (
        await client.post(
            f"{API}/salons", headers=auth(st), json={"name": "Z", "city": "Z", "address": "z", "phone": "9876500009"}
        )
    ).status_code == 403
    dash = (await client.get(f"{API}/dashboard", headers=auth(st))).json()
    assert [c["key"] for c in dash["cards"]] == ["my_today", "commission", "next7"]


async def test_manager_sees_team_in_own_salon_only(client):
    s = await _setup(client)
    await client.post(
        f"{API}/users",
        headers=auth(s["ot"]),
        json={"fullName": "B staff", "email": "bs@glow.in", "role": "staff", "salonIds": [s["b"]]},
    )
    r = await client.get(f"{API}/users", headers=auth(s["manager"]["token"]))
    emails = {u["email"] for u in r.json()["items"]}
    assert emails == {"mgr@glow.in", "riya@glow.in"}


async def test_other_tenants_are_invisible(client):
    s = await _setup(client)
    client.cookies.clear()
    other = await register_owner(client, email="boss@other.in", business="Other Spa")
    ot2 = other["accessToken"]
    assert (await client.get(f"{API}/salons/{s['a']}", headers=auth(ot2))).status_code == 404
    assert (await client.get(f"{API}/users/{s['staff']['user']['id']}", headers=auth(ot2))).status_code == 404
    r = await client.post(
        f"{API}/users", headers=auth(ot2), json={"fullName": "X", "email": "x@o.in", "role": "staff", "salonIds": [s["a"]]}
    )
    assert r.status_code == 403


async def test_deactivated_user_is_signed_out_everywhere(client):
    s = await _setup(client)
    st = s["staff"]["token"]
    r = await client.patch(f"{API}/users/{s['staff']['user']['id']}", headers=auth(s["ot"]), json={"isActive": False})
    assert r.status_code == 200 and r.json()["isActive"] is False
    assert (await client.get(f"{API}/auth/me", headers=auth(st))).status_code == 401
    r = await client.post(f"{API}/auth/login", json={"email": "riya@glow.in", "password": PASSWORD})
    assert r.status_code == 401


async def test_owner_cannot_deactivate_self(client):
    owner = await register_owner(client)
    r = await client.patch(f"{API}/users/{owner['user']['id']}", headers=auth(owner["accessToken"]), json={"isActive": False})
    assert r.status_code == 400


async def test_invited_user_cannot_login_before_accepting(client):
    owner = await register_owner(client)
    a = owner["user"]["salons"][0]["id"]
    r = await client.post(
        f"{API}/users",
        headers=auth(owner["accessToken"]),
        json={"fullName": "P", "email": "p@glow.in", "role": "staff", "salonIds": [a]},
    )
    assert r.json()["invitePending"] is True
    r = await client.post(f"{API}/auth/login", json={"email": "p@glow.in", "password": PASSWORD})
    assert r.status_code == 401
    token = last_token_from_email()
    assert (await client.post(f"{API}/auth/accept-invite", json={"token": token, "password": PASSWORD})).status_code == 200


async def test_move_staff_between_salons(client):
    s = await _setup(client)
    sid = s["staff"]["user"]["id"]
    r = await client.put(f"{API}/users/{sid}/salons", headers=auth(s["ot"]), json={"salonIds": [s["b"]]})
    assert r.status_code == 200 and r.json()["salonIds"] == [s["b"]]


async def test_business_settings_owner_writes_admin_reads(client):
    s = await _setup(client)
    body = {
        "name": "Glow Studio",
        "type": "Salon",
        "email": "hi@glow.in",
        "phone": "9876500000",
        "address": "Mumbai",
        "gst": "27aabcu9603r1zx",
        "currency": "inr",
        "timezone": "Asia/Kolkata",
    }
    r = await client.put(f"{API}/settings/business", headers=auth(s["ot"]), json=body)
    assert r.status_code == 200 and r.json()["gst"] == "27AABCU9603R1ZX" and r.json()["currency"] == "INR"
    assert (await client.get(f"{API}/settings/business", headers=auth(s["admin"]["token"]))).json()["name"] == "Glow Studio"
    assert (await client.put(f"{API}/settings/business", headers=auth(s["admin"]["token"]), json=body)).status_code == 403
    bad = await client.put(f"{API}/settings/business", headers=auth(s["ot"]), json={**body, "gst": "123"})
    assert bad.status_code == 422


async def test_notification_prefs_roundtrip(client):
    owner = await register_owner(client)
    h = auth(owner["accessToken"])
    prefs = (await client.get(f"{API}/settings/notifications", headers=h)).json()
    assert prefs["weeklySummary"] is True
    prefs["dailySummary"] = True
    assert (await client.put(f"{API}/settings/notifications", headers=h, json=prefs)).json()["dailySummary"] is True
    assert (await client.get(f"{API}/settings/notifications", headers=h)).json()["dailySummary"] is True


async def test_public_salon_listing_hides_inactive(client):
    s = await _setup(client)
    assert (await client.delete(f"{API}/salons/{s['c']}", headers=auth(s["ot"]))).status_code == 204
    names = {x["name"] for x in (await client.get(f"{API}/public/salons")).json()}
    assert "C" not in names and "B" in names


async def test_owner_dashboard_cards_and_modules(client):
    s = await _setup(client)
    d = (await client.get(f"{API}/dashboard", headers=auth(s["ot"]))).json()
    cards = {c["key"]: c["value"] for c in d["cards"]}
    assert cards["salons"] == 3 and cards["team"] == 2
    assert d["scopeLabel"] == "All my salons"
    assert len(d["revenueTrend"]) == 7
    mods = {m["key"]: m for m in d["modules"]}
    assert mods["branches"]["available"] and not mods["billing"]["available"]
    assert mods["billing"]["release"] == "V3"
