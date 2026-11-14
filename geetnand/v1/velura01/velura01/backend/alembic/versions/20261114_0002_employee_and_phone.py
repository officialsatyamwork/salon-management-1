"""employee role and unique login phone

Revision ID: 0002
Revises: 0001
Create Date: 2026-11-14 08:30:00.000000
"""

from collections.abc import Sequence

from alembic import op

revision: str = "0002"
down_revision: str | None = "0001"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    # PostgreSQL allows ADD VALUE inside a transaction from version 12.
    # The new value is not used in this migration, so it is safe here.
    op.execute("ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'employee'")
    op.create_unique_constraint("uq_users_phone", "users", ["phone"])


def downgrade() -> None:
    op.drop_constraint("uq_users_phone", "users", type_="unique")
    # PostgreSQL cannot drop a single enum label. 'employee' stays on downgrade.
