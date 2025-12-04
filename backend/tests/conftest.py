"""
Pytest fixtures for backend tests
Provides test database, client, and authentication fixtures
"""
import pytest
import pytest_asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from httpx import AsyncClient
from typing import AsyncGenerator

from app.main import app
from app.core.database import Base, get_db
from app.core.security import create_access_token
from datetime import timedelta

# Test database (SQLite for simplicity)
TEST_DATABASE_URL = "sqlite+aiosqlite:///./test.db"

engine = create_async_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    echo=False
)

TestingSessionLocal = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)


@pytest_asyncio.fixture(scope="function")
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    """
    Create a fresh database for each test function
    """
    # Create all tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Create session
    async with TestingSessionLocal() as session:
        yield session
    
    # Drop all tables after test
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest_asyncio.fixture(scope="function")
async def client(db_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    """
    FastAPI test client with test database
    """
    async def override_get_db():
        yield db_session
    
    app.dependency_overrides[get_db] = override_get_db
    
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac
    
    app.dependency_overrides.clear()


@pytest.fixture
def admin_token() -> str:
    """
    Generate admin JWT token for tests
    """
    return create_access_token(
        subject="admin@test.com",
        expires_delta=timedelta(hours=1)
    )


@pytest.fixture
def morador_token() -> str:
    """
    Generate morador JWT token for tests
    """
    return create_access_token(
        subject="morador@test.com",
        expires_delta=timedelta(hours=1)
    )


@pytest.fixture
def funcionario_token() -> str:
    """
    Generate funcionario JWT token for tests
    """
    return create_access_token(
        subject="funcionario@test.com",
        expires_delta=timedelta(hours=1)
    )


@pytest.fixture
def auth_headers_admin(admin_token: str) -> dict:
    """
    Authorization headers for admin user
    """
    return {"Authorization": f"Bearer {admin_token}"}


@pytest.fixture
def auth_headers_morador(morador_token: str) -> dict:
    """
    Authorization headers for morador user
    """
    return {"Authorization": f"Bearer {morador_token}"}


@pytest.fixture
def auth_headers_funcionario(funcionario_token: str) -> dict:
    """
    Authorization headers for funcionario user
    """
    return {"Authorization": f"Bearer {funcionario_token}"}
