from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy import text
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://user:password@localhost:5432/sindicoai")

engine = create_async_engine(DATABASE_URL, echo=True)

AsyncSessionLocal = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

Base = declarative_base()


async def set_tenant_context(session: AsyncSession, tenant_id: str) -> None:
    """
    Set the current tenant context for RLS policies.
    This must be called before any query that should be tenant-scoped.
    
    Args:
        session: The database session
        tenant_id: The tenant ID to set in the session context
    """
    # Only execute on PostgreSQL (SQLite doesn't support this)
    dialect = session.bind.dialect.name if session.bind else "unknown"
    if dialect == "postgresql":
        await session.execute(text(f"SET app.current_tenant_id = '{tenant_id}'"))


async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

