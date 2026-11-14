# Velura — Salon Management Platform (V1)

V1 covers your spec's scope: the landing page, login and registration, the five-role access model with salon-level data boundaries, role-specific dashboards, and module cards for everything coming in V2–V4.

```
backend/    FastAPI + PostgreSQL API (async SQLAlchemy, Alembic migrations)
frontend/   React (Vite) app, now wired to the API
document/   V1 scope document
docker-compose.yml   Postgres + API + nginx, production style
```

## What works in V1

| Area | Status |
|---|---|
| Business sign-up (creates business, first salon, owner account, 14-day trial) | Live |
| Login, logout, "remember me" via secure refresh cookie, session survives reload | Live |
| Forgot / reset password by email, change password (signs out other devices) | Live |
| Invite team members by email; they set their own password | Live |
| Five roles with salon scoping enforced in the API | Live |
| Owner grants or revokes an admin's access salon by salon | Live (Settings → Team & Access) |
| Role-specific dashboard cards; "All my salons" switcher | Live |
| Branches: list, add, deactivate, reactivate | Live |
| Business profile (with GSTIN check) and notification preferences | Live |
| Appointments, customers, staff, services, membership | Sample-data preview, marked **V2** |
| Billing, inventory, marketing, reports | Sample-data preview, marked **V3** |

### Roles

| Role | Salons | Sees |
|---|---|---|
| `master_admin` (Owner) | All salons in the business | Everything; manages admins' salon access |
| `super_admin` (Admin) | Salons granted via memberships | Dashboard, team, branches, settings for those salons |
| `manager` | Exactly one salon | Operations pages, team list. **The API never returns revenue to managers.** |
| `staff` | Exactly one salon | Own dashboard (appointments, commission, next 7 days) |
| `customer` | Browses all salons | Own bookings |

Hiding a page in the UI is only a convenience: every rule is enforced by the API (see `backend/app/services/access.py`). Salons a user can't reach return 404, so other businesses' data can't even be confirmed to exist.

## Run locally

Needs Python 3.12+, Node 20+, PostgreSQL 14+.

```bash
# 1. Database
createuser -P salon            # password: salon
createdb -O salon salon

# 2. API
cd backend
pip install -r requirements-dev.txt
cp .env.example .env           # defaults suit local dev
alembic upgrade head
python -m app.scripts.seed     # demo business + one user per role
uvicorn app.main:app --reload --port 8000
# API docs: http://localhost:8000/docs

# 3. Frontend (new terminal)
cd frontend
npm ci
npm run dev                    # http://localhost:5173 (proxies /api to :8000)
```

Demo logins after seeding (password `Velura@123` for all):

| Email | Role |
|---|---|
| owner@glowsalon.com | Owner, 3 salons |
| admin@glowsalon.com | Admin for Andheri + Bandra |
| manager@glowsalon.com | Manager, Andheri |
| riya@glowsalon.com | Staff, Andheri |
| customer@example.com | Customer |

In local dev, emails (invites, password resets) are printed to the API log instead of being sent.

## Tests

```bash
createdb -O salon salon_test
cd backend && pytest -q        # 35 tests against real PostgreSQL
ruff check app tests
```

They cover sign-up, login, rate limiting, refresh-token rotation and reuse detection, logout, password change/reset, invites, every role's salon scope, the manager no-revenue rule, cross-business isolation, access grant/revoke, deactivation, settings validation and the dashboard. GitHub Actions runs them, the migration check and the frontend build on every push (`.github/workflows/ci.yml`).

## Deploy (Docker)

```bash
cp .env.example .env           # set POSTGRES_PASSWORD, JWT_SECRET, PUBLIC_URL, SMTP_*
docker compose up -d --build   # app on :8080
```

- Migrations run automatically when the API container starts (`RUN_MIGRATIONS=false` to run them as a separate release step).
- nginx serves the React build and proxies `/api` on the same origin, so the refresh cookie stays first-party.
- Put HTTPS in front of port 8080 (Caddy, Traefik, Cloudflare or a cloud load balancer). The refresh cookie is `Secure` by default and needs HTTPS.
- Health checks: `GET /health` (process up), `GET /ready` (database reachable).
- In production the API refuses to start with the default `JWT_SECRET`, and hides `/docs`.

### Security notes

- Passwords hashed with Argon2; login timing is the same whether or not an email exists.
- Access tokens last 15 minutes and are kept in memory only (never localStorage). Refresh tokens live in an httpOnly, `SameSite=strict` cookie scoped to `/api/v1/auth`, and rotate on every use. Reusing an old one revokes the whole session.
- Password change, reset and account deactivation instantly invalidate every outstanding access token.
- Login, sign-up and forgot-password are rate limited. The limiter is in-process; when you run more than one API container, move it to Redis.
- Every sign-in, user change and access grant/revoke is written to `audit_logs`.
- JSON logs with a request ID on every line and response.

## API overview (`/api/v1`)

| Method & path | Who |
|---|---|
| `POST /auth/register` · `/auth/register/customer` · `/auth/login` · `/auth/refresh` · `/auth/logout` | Public |
| `POST /auth/forgot-password` · `/auth/reset-password` · `/auth/accept-invite` | Public |
| `GET /auth/me` · `POST /auth/change-password` | Signed in |
| `GET /users` · `POST /users` · `GET/PATCH /users/{id}` · `POST /users/{id}/resend-invite` | Owner, admin (manager: read) |
| `PUT /users/{id}/salons` | Owner, admin: move managers and staff |
| `POST/DELETE /users/{id}/salons/{salonId}` | Owner: grant or revoke an admin's salon |
| `GET /salons` · `GET /salons/{id}` | Scoped to the user's salons |
| `POST /salons` · `DELETE /salons/{id}` | Owner |
| `PATCH /salons/{id}` | Owner, admin (status: owner only) |
| `GET /public/salons` | Public: active salons for customers |
| `GET/PUT /settings/business` | Owner writes, admin reads |
| `GET/PUT /settings/notifications` | Owner, admin |
| `GET /dashboard?salonId=` | Signed in; cards depend on role |

Errors always look like `{"error": {"code": "...", "message": "...", "details": [...]}}`.

## Next (V2)

The data model already has `tenant_id` and `salon_id` boundaries and the dashboard returns the card structure, so V2 adds tables and fills in the numbers: services and staff schedules, appointments and the calendar, customers, commission. The module-release map lives in `backend/app/services/access.py` (`RELEASED`) and `frontend/src/store/auth.js` (`LIVE_MODULES`); flip a module there when it goes live.





























######################################################################################################################
##to run it
Open the folder in VS Code with **File → Open Folder** and choose `/Users/geetanandmolleti/Desktop/velura01`. Then open three terminals with **Terminal → New Terminal**.

This copy is already running on this Mac, so http://localhost:5173 works right now. Use the steps below when you want to start it yourself (after a restart, or after you stop the current windows).

**Terminal 1 — database**

```bash
export PATH="$(brew --prefix postgresql@16)/bin:$PATH"
pg_ctl -D /tmp/velura-pg status || pg_ctl -D /tmp/velura-pg -l /tmp/velura-pg.log -o "-p 55432 -h 127.0.0.1" -w start
```

**Terminal 2 — API**

```bash
cd /Users/geetanandmolleti/Desktop/velura01/backend
/tmp/velura-py312/bin/python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Leave that window open. You should see `Uvicorn running on http://0.0.0.0:8000`. Check it at http://127.0.0.1:8000/ready — it should say `{"status":"ready"}`.

**Terminal 3 — website**

```bash
cd /Users/geetanandmolleti/Desktop/velura01/frontend
npm run dev -- --host 0.0.0.0 --port 5173
```

Leave that window open, then open http://localhost:5173. Login is at http://localhost:5173/login. Demo password for every seeded account is `Velura@123` (for example `owner@glowsalon.com`, `admin@glowsalon.com`, `manager@glowsalon.com`, `riya@glowsalon.com`).

Use `/tmp/velura-py312/bin/python` for the API. The `.venv` inside the folder is Python 3.14 and cannot start the server. `backend/.env` is already filled in, and the database already has the demo salons, so you do not need to install packages or seed again on this Mac.

If a start command says the port is already in use, the app is already up — open http://localhost:5173 instead of starting a second copy.