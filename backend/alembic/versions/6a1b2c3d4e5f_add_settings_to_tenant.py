"""add_settings_to_tenant

Revision ID: 6a1b2c3d4e5f
Revises: 5518a9a5282f
Create Date: 2025-12-01 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = '6a1b2c3d4e5f'
down_revision: Union[str, Sequence[str], None] = '5518a9a5282f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema: Add settings fields to tenants table."""
    # Add new columns to tenants table
    op.add_column('tenants', sa.Column('phone', sa.String(), nullable=True))
    op.add_column('tenants', sa.Column('cnpj', sa.String(), nullable=True))
    op.add_column('tenants', sa.Column('city', sa.String(), nullable=True))
    op.add_column('tenants', sa.Column('state', sa.String(), nullable=True))
    op.add_column('tenants', sa.Column('zipcode', sa.String(), nullable=True))

    # Add JSON columns for settings
    op.add_column('tenants', sa.Column('reservation_settings',
        postgresql.JSON(astext_type=sa.Text()),
        nullable=True,
        server_default=sa.text("'{\"min_hours_advance\": 1, \"max_days_advance\": 30, \"max_hours_duration\": 4, \"cancellation_hours_advance\": 24}'::json")
    ))

    op.add_column('tenants', sa.Column('notification_settings',
        postgresql.JSON(astext_type=sa.Text()),
        nullable=True,
        server_default=sa.text("'{\"email_enabled\": true, \"sms_enabled\": false, \"push_enabled\": true, \"notification_email\": \"\", \"quiet_hours_start\": \"22:00\", \"quiet_hours_end\": \"08:00\"}'::json")
    ))

    # Add updated_at column
    op.add_column('tenants', sa.Column('updated_at',
        sa.DateTime(timezone=True),
        server_default=sa.text('now()'),
        nullable=True
    ))


def downgrade() -> None:
    """Downgrade schema: Remove settings fields from tenants table."""
    op.drop_column('tenants', 'updated_at')
    op.drop_column('tenants', 'notification_settings')
    op.drop_column('tenants', 'reservation_settings')
    op.drop_column('tenants', 'zipcode')
    op.drop_column('tenants', 'state')
    op.drop_column('tenants', 'city')
    op.drop_column('tenants', 'cnpj')
    op.drop_column('tenants', 'phone')
