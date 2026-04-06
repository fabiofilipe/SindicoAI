"""Add session version and refresh JTI to users

Revision ID: c1f4a8d9e2b3
Revises: 8bdb6bfa8923
Create Date: 2026-04-05

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c1f4a8d9e2b3'
down_revision: Union[str, Sequence[str], None] = '8bdb6bfa8923'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('users', sa.Column('session_version', sa.Integer(), nullable=False, server_default='0'))
    op.add_column('users', sa.Column('current_refresh_jti', sa.String(), nullable=True))
    op.alter_column('users', 'session_version', server_default=None)


def downgrade() -> None:
    op.drop_column('users', 'current_refresh_jti')
    op.drop_column('users', 'session_version')
