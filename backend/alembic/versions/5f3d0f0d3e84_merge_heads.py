"""merge_heads

Revision ID: 5f3d0f0d3e84
Revises: 001_initial, ad636bb7fda1
Create Date: 2025-11-20 18:44:50.510742

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5f3d0f0d3e84'
down_revision: Union[str, Sequence[str], None] = ('001_initial', 'ad636bb7fda1')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
