"""Add RLS policies for all tenant-scoped tables

Revision ID: add_rls_policies
Revises: 6a1b2c3d4e5f_add_settings_to_tenant
Create Date: 2025-12-06

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_rls_policies'
down_revision = '6a1b2c3d4e5f'
branch_labels = None
depends_on = None


def upgrade() -> None:
    """
    Enable Row Level Security on all tenant-scoped tables.
    Uses PostgreSQL RLS to ensure data isolation between tenants.
    """
    # Skip if not PostgreSQL (SQLite doesn't support RLS)
    connection = op.get_bind()
    if connection.dialect.name != 'postgresql':
        return

    # Enable RLS on all tenant-scoped tables
    tables_with_tenant_id = ['users', 'units', 'common_areas', 'reservations', 'notifications']
    
    for table in tables_with_tenant_id:
        # Enable RLS
        op.execute(f'ALTER TABLE {table} ENABLE ROW LEVEL SECURITY')
        
        # Create policy for tenant isolation
        # Using current_setting with 'true' as second param makes it return NULL if not set (instead of error)
        op.execute(f'''
            CREATE POLICY tenant_isolation_{table} ON {table}
            FOR ALL
            USING (tenant_id = current_setting('app.current_tenant_id', true))
            WITH CHECK (tenant_id = current_setting('app.current_tenant_id', true))
        ''')
    
    # Special policy for tenants table (users can only see their own tenant)
    op.execute('ALTER TABLE tenants ENABLE ROW LEVEL SECURITY')
    op.execute('''
        CREATE POLICY tenant_isolation_tenants ON tenants
        FOR ALL
        USING (id = current_setting('app.current_tenant_id', true))
        WITH CHECK (id = current_setting('app.current_tenant_id', true))
    ''')


def downgrade() -> None:
    """
    Disable RLS and drop all policies.
    """
    # Skip if not PostgreSQL
    connection = op.get_bind()
    if connection.dialect.name != 'postgresql':
        return

    # Drop policies and disable RLS on all tables
    tables_with_tenant_id = ['users', 'units', 'common_areas', 'reservations', 'notifications']
    
    for table in tables_with_tenant_id:
        op.execute(f'DROP POLICY IF EXISTS tenant_isolation_{table} ON {table}')
        op.execute(f'ALTER TABLE {table} DISABLE ROW LEVEL SECURITY')
    
    # Drop tenants table policy
    op.execute('DROP POLICY IF EXISTS tenant_isolation_tenants ON tenants')
    op.execute('ALTER TABLE tenants DISABLE ROW LEVEL SECURITY')
