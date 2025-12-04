"""
Integration tests for authentication endpoints
Tests login, token refresh, and protected routes
"""
import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.base import User, Tenant
from app.core.security import get_password_hash


@pytest.mark.asyncio
async def test_login_success(client: AsyncClient, db_session: AsyncSession):
    """Test successful login with valid credentials"""
    # Create tenant first
    tenant = Tenant(
        id="test-tenant-1",
        name="Test Condominium"
    )
    db_session.add(tenant)
    
    # Create test user
    user = User(
        id="test-user-1",
        email="test@example.com",
        hashed_password=get_password_hash("password123"),
        full_name="Test User",
        role="morador",
        tenant_id="test-tenant-1",
        
    )
    db_session.add(user)
    await db_session.commit()
    
    # Attempt login
    response = await client.post(
        "/api/v1/auth/login",
        data={
            "username": "test@example.com",
            "password": "password123"
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"


@pytest.mark.asyncio
async def test_login_invalid_email(client: AsyncClient):
    """Test login with non-existent email"""
    response = await client.post(
        "/api/v1/auth/login",
        data={
            "username": "nonexistent@example.com",
            "password": "password123"
        }
    )
    
    assert response.status_code == 400
    assert "Incorrect email or password" in response.json()["detail"]


@pytest.mark.asyncio
async def test_login_invalid_password(client: AsyncClient, db_session: AsyncSession):
    """Test login with wrong password"""
    # Create tenant and user
    tenant = Tenant(
        id="test-tenant-2",
        name="Test Condo",
        
    )
    user = User(
        id="test-user-2",
        email="user@example.com",
        hashed_password=get_password_hash("correctpassword"),
        full_name="User",
        role="morador",
        tenant_id="test-tenant-2",
        
    )
    db_session.add_all([tenant, user])
    await db_session.commit()
    
    response = await client.post(
        "/api/v1/auth/login",
        data={
            "username": "user@example.com",
            "password": "wrongpassword"
        }
    )
    
    assert response.status_code == 400
    assert "Incorrect email or password" in response.json()["detail"]


@pytest.mark.asyncio
async def test_login_inactive_user(client: AsyncClient, db_session: AsyncSession):
    """Test login with inactive user"""
    tenant = Tenant(
        id="test-tenant-3",
        name="Test Condo",
        
    )
    user = User(
        id="test-user-3",
        email="inactive@example.com",
        hashed_password=get_password_hash("password123"),
        full_name="Inactive User",
        role="morador",
        tenant_id="test-tenant-3",
        is_active=False  # Inactive
    )
    db_session.add_all([tenant, user])
    await db_session.commit()
    
    response = await client.post(
        "/api/v1/auth/login",
        data={
            "username": "inactive@example.com",
            "password": "password123"
        }
    )
    
    assert response.status_code == 400
    assert "Inactive user" in response.json()["detail"]


@pytest.mark.asyncio
async def test_token_refresh_success(client: AsyncClient, db_session: AsyncSession):
    """Test refreshing token with valid refresh token"""
    from app.core.security import create_refresh_token
    from datetime import timedelta
    
    # Create tenant and user
    tenant = Tenant(
        id="test-tenant-4",
        name="Test Condo",
        
    )
    user = User(
        id="test-user-4",
        email="refresh@example.com",
        hashed_password=get_password_hash("password123"),
        full_name="Refresh User",
        role="morador",
        tenant_id="test-tenant-4",
        
    )
    db_session.add_all([tenant, user])
    await db_session.commit()
    
    # Generate refresh token
    refresh_token = create_refresh_token(
        user.id,
        expires_delta=timedelta(days=7)
    )
    
    # Use refresh token to get new access token
    response = await client.post(
        "/api/v1/auth/refresh",
        json={"refresh_token": refresh_token}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data


@pytest.mark.asyncio
async def test_token_refresh_invalid_token(client: AsyncClient):
    """Test refresh with invalid token"""
    response = await client.post(
        "/api/v1/auth/refresh",
        json={"refresh_token": "invalid.token.here"}
    )
    
    assert response.status_code == 403
    assert "Could not validate credentials" in response.json()["detail"]


@pytest.mark.asyncio
async def test_protected_endpoint_without_token(client: AsyncClient):
    """Test accessing protected endpoint without authentication"""
    response = await client.get("/api/v1/users/me")
    
    assert response.status_code == 401
    assert "Not authenticated" in response.json()["detail"]


@pytest.mark.asyncio
async def test_protected_endpoint_with_token(client: AsyncClient, db_session: AsyncSession):
    """Test accessing protected endpoint with valid token"""
    from app.core.security import create_access_token
    from datetime import timedelta
    
    # Create tenant and user
    tenant = Tenant(
        id="test-tenant-5",
        name="Test Condo",
        
    )
    user = User(
        id="test-user-5",
        email="protected@example.com",
        hashed_password=get_password_hash("password123"),
        full_name="Protected User",
        role="morador",
        tenant_id="test-tenant-5",
        
    )
    db_session.add_all([tenant, user])
    await db_session.commit()
    
    # Generate access token
    access_token = create_access_token(
        user.id,
        expires_delta=timedelta(minutes=30)
    )
    
    # Access protected endpoint
    response = await client.get(
        "/api/v1/users/me",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "protected@example.com"
    assert data["full_name"] == "Protected User"
