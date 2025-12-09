"""Add category field to documents table

Revision ID: add_document_category
Revises: add_rls_policies
Create Date: 2025-12-09

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'add_document_category'
down_revision = 'add_rls_policies'
branch_labels = None
depends_on = None


def upgrade() -> None:
    """
    Add category field to documents table with ENUM type.
    Enables categorization of documents (regimentos, atas, comunicados, etc.)
    """
    # Create ENUM type for document categories
    document_category = postgresql.ENUM(
        'regimentos', 'atas', 'comunicados', 'relatorios', 'outros',
        name='document_category',
        create_type=True
    )
    document_category.create(op.get_bind(), checkfirst=True)

    # Add category column with default 'outros'
    op.add_column('documents',
        sa.Column('category',
            sa.Enum('regimentos', 'atas', 'comunicados', 'relatorios', 'outros',
                    name='document_category'),
            nullable=False,
            server_default='outros'
        )
    )

    # Create index for faster category filtering
    op.create_index('ix_documents_category', 'documents', ['category'])


def downgrade() -> None:
    """
    Remove category field and ENUM type.
    """
    # Drop index
    op.drop_index('ix_documents_category', table_name='documents')

    # Drop column
    op.drop_column('documents', 'category')

    # Drop ENUM type
    sa.Enum(name='document_category').drop(op.get_bind(), checkfirst=True)
