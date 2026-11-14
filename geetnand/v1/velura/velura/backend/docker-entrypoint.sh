#!/bin/sh
set -e
# Apply database migrations before the API starts. Set RUN_MIGRATIONS=false
# if you run them as a separate release step instead.
if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
  alembic upgrade head
fi
exec "$@"
