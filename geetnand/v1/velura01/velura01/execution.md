# Run Velura locally on macOS

This guide runs the React frontend, FastAPI backend, and PostgreSQL directly on
your Mac. Docker is not required.

## Requirements

- Python 3.12 or newer
- Node.js 20 or newer and npm
- Homebrew and PostgreSQL 16 (`brew install postgresql@16`)

Run commands in Terminal from the project folder:

```bash
cd /path/to/velura
```

Replace `/path/to/velura` with the folder where you saved this project.

## One-time setup

### 1. Start and prepare PostgreSQL

This setup uses port `55432` so it does not conflict with another PostgreSQL
installation on the default port `5432`. It creates a local development
database under `/tmp/velura-pg`.

```bash
export PATH="$(brew --prefix postgresql@16)/bin:$PATH"
mkdir -p /tmp/velura-pg

if [ ! -f /tmp/velura-pg/PG_VERSION ]; then
  initdb -D /tmp/velura-pg --username=postgres --auth=trust --no-locale
fi

if ! pg_ctl -D /tmp/velura-pg status >/dev/null 2>&1; then
  pg_ctl -D /tmp/velura-pg -l /tmp/velura-pg.log \
    -o "-p 55432 -h 127.0.0.1" -w start
fi

if ! psql -h 127.0.0.1 -p 55432 -U postgres -d postgres -tAc \
  "SELECT 1 FROM pg_roles WHERE rolname='salon'" | grep -q 1; then
  psql -h 127.0.0.1 -p 55432 -U postgres -d postgres \
    -c "CREATE ROLE salon WITH LOGIN PASSWORD 'salon';"
fi

if ! psql -h 127.0.0.1 -p 55432 -U postgres -d postgres -tAc \
  "SELECT 1 FROM pg_database WHERE datname='salon'" | grep -q 1; then
  createdb -h 127.0.0.1 -p 55432 -U postgres -O salon salon
fi
```

This database authentication setup is for local development only. Do not reuse
it for a production deployment.

### 2. Configure and install the backend

Create the local environment file if it does not already exist, then set the
development database and browser settings:

```bash
if [ ! -f backend/.env ]; then
  cp backend/.env.example backend/.env
fi
nano backend/.env
```

Set or confirm these values in `backend/.env`:

```dotenv
ENVIRONMENT=development
DATABASE_URL=postgresql+asyncpg://salon:salon@127.0.0.1:55432/salon
JWT_SECRET=dev-secret-key-must-be-32-chars-long
REFRESH_COOKIE_SECURE=false
CORS_ORIGINS=http://localhost:5173
FRONTEND_URL=http://localhost:5173
EMAIL_BACKEND=console
```

Save and exit nano with `Ctrl+O`, `Enter`, then `Ctrl+X`. Keep `backend/.env`
local; it is ignored by Git.

Then install dependencies, create the database schema, and load demo accounts:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements-dev.txt

cd backend
../.venv/bin/alembic upgrade head
../.venv/bin/python -m app.scripts.seed
cd ..
```

### 3. Install frontend dependencies

```bash
cd frontend
npm install
cd ..
```

## Start the application

Start PostgreSQL with the command from step 1 if it is not already running.
Then open two Terminal windows (or tabs).

**Terminal 1 — backend API:**

```bash
cd /path/to/velura
source .venv/bin/activate
cd backend
../.venv/bin/uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 — frontend:**

```bash
cd /path/to/velura/frontend
npm run dev -- --host 0.0.0.0 --port 5173
```

Open the app at <http://localhost:5173>. The API is at
<http://localhost:8000>, and interactive API documentation is at
<http://localhost:8000/docs>.

## Demo login

The seed script creates demo accounts with the same password:

**Password:** `Velura@123`

| Account | Role |
|---|---|
| `owner@glowsalon.com` | Owner |
| `admin@glowsalon.com` | Admin |
| `manager@glowsalon.com` | Manager |
| `riya@glowsalon.com` | Staff |
| `customer@example.com` | Customer |

Emails such as password resets are printed in the backend terminal during local
development.

## Confirm the database connection

With the backend running, open <http://localhost:8000/ready>. A response of
`{"status":"ready"}` means the API can reach PostgreSQL.

## Stop the application

- Press `Ctrl+C` in the frontend and backend terminals.
- Stop PostgreSQL when you no longer need it:

  ```bash
  export PATH="$(brew --prefix postgresql@16)/bin:$PATH"
  pg_ctl -D /tmp/velura-pg stop
  ```

The database files are under `/tmp/velura-pg`; macOS may clear temporary files.
If you need to keep local data long term, move the database to a persistent
directory before initializing it.

## Troubleshooting

- **Port `55432` is already in use:** Check whether this database is already
  running with `pg_ctl -D /tmp/velura-pg status`. If another service owns that
  port, stop it or choose another port and update `DATABASE_URL` to match.
- **API reports database unavailable:** Confirm PostgreSQL is running and that
  `DATABASE_URL` in `backend/.env` uses port `55432`. Then check
  <http://localhost:8000/ready>.
- **`alembic` or `uvicorn` is not found:** Activate the project environment
  with `source .venv/bin/activate`, or use the `../.venv/bin/...` commands
  above from the `backend` directory.
- **The frontend cannot reach the API:** Run the backend on port `8000` and
  the frontend on port `5173`; the Vite development server proxies API requests
  to the backend.
