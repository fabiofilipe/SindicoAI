"""Add scheduled_for and sent_at fields to notifications

Revision ID: add_scheduled_notifications
Revises: add_password_reset_fields
Create Date: 2025-12-15

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'add_scheduled_notifications'
down_revision = 'add_password_reset_fields'
branch_labels = None
depends_on = None


def upgrade() -> None:
    """
    Add scheduled_for and sent_at fields to notifications table
    for scheduled notification functionality.
    """
    op.add_column('notifications',
        sa.Column('scheduled_for', sa.DateTime(timezone=True), nullable=True)
    )
    op.add_column('notifications',
        sa.Column('sent_at', sa.DateTime(timezone=True), nullable=True)
    )

    # Create index for faster queries on scheduled notifications
    op.create_index('ix_notifications_scheduled_for', 'notifications', ['scheduled_for'])


def downgrade() -> None:
    """
    Remove scheduled notification fields.
    """
    op.drop_index('ix_notifications_scheduled_for', table_name='notifications')
    op.drop_column('notifications', 'sent_at')
    op.drop_column('notifications', 'scheduled_for')
