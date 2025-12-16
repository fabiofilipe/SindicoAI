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
    from httpx import ASGITransport
    
    async def override_get_db():
        yield db_session
    
    app.dependency_overrides[get_db] = override_get_db
    
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
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


@pytest_asyncio.fixture
async def test_tenant(db_session: AsyncSession):
    """
    Create a test tenant
    """
    from app.models.base import Tenant
    tenant = Tenant(
        id="test-tenant-123",
        name="Test Condominium",
        domain="test.condominium.com"
    )
    db_session.add(tenant)
    await db_session.commit()
    await db_session.refresh(tenant)
    return {"id": tenant.id, "name": tenant.name}


@pytest_asyncio.fixture
async def test_user(db_session: AsyncSession, test_tenant):
    """
    Create a test user
    """
    from app.models.base import User
    from app.core.security import get_password_hash

    user = User(
        id="test-user-123",
        email="test@example.com",
        hashed_password=get_password_hash("TestPassword123!"),
        full_name="Test User",
        role="admin",
        tenant_id=test_tenant["id"]
    )
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)
    return {
        "id": user.id,
        "email": user.email,
        "tenant_id": user.tenant_id
    }


@pytest_asyncio.fixture
async def test_user_with_reset_token(db_session: AsyncSession, test_tenant):
    """
    Create a test user with a valid reset token
    """
    from app.models.base import User
    from app.core.security import get_password_hash
    from datetime import datetime, timedelta
    import secrets

    reset_token = secrets.token_urlsafe(32)

    user = User(
        id="test-user-with-token",
        email="reset@example.com",
        hashed_password=get_password_hash("OldPassword123!"),
        full_name="Reset User",
        role="resident",
        tenant_id=test_tenant["id"],
        reset_token=reset_token,
        reset_token_expires=datetime.utcnow() + timedelta(hours=1)
    )
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)
    return {
        "id": user.id,
        "email": user.email,
        "reset_token": reset_token,
        "tenant_id": user.tenant_id
    }


@pytest_asyncio.fixture
async def test_user_with_expired_token(db_session: AsyncSession, test_tenant):
    """
    Create a test user with an expired reset token
    """
    from app.models.base import User
    from app.core.security import get_password_hash
    from datetime import datetime, timedelta
    import secrets

    reset_token = secrets.token_urlsafe(32)

    user = User(
        id="test-user-expired-token",
        email="expired@example.com",
        hashed_password=get_password_hash("OldPassword123!"),
        full_name="Expired User",
        role="resident",
        tenant_id=test_tenant["id"],
        reset_token=reset_token,
        reset_token_expires=datetime.utcnow() - timedelta(hours=1)  # Expired
    )
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)
    return {
        "id": user.id,
        "email": user.email,
        "reset_token": reset_token,
        "tenant_id": user.tenant_id
    }


@pytest_asyncio.fixture
async def async_client(client):
    """
    Alias for client fixture for better naming
    """
    return client
