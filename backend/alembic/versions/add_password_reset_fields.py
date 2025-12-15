"""Add password reset fields to users table

Revision ID: add_password_reset_fields
Revises: add_document_category
Create Date: 2025-12-15

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'add_password_reset_fields'
down_revision = 'add_document_category'
branch_labels = None
depends_on = None


def upgrade() -> None:
    """
    Add reset_token and reset_token_expires fields to users table
    for password recovery functionality.
    """
    op.add_column('users',
        sa.Column('reset_token', sa.String(), nullable=True)
    )
    op.add_column('users',
        sa.Column('reset_token_expires', sa.DateTime(timezone=True), nullable=True)
    )

    # Create index for faster token lookups
    op.create_index('ix_users_reset_token', 'users', ['reset_token'])


def downgrade() -> None:
    """
    Remove password reset fields.
    """
    op.drop_index('ix_users_reset_token', table_name='users')
    op.drop_column('users', 'reset_token_expires')
    op.drop_column('users', 'reset_token')
