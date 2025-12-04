"""
Integration tests for user management endpoints
Tests admin CRUD operations on users
"""
import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import timedelta

from app.models.base import User, Tenant, Unit
from app.core.security import get_password_hash, create_access_token


@pytest.mark.asyncio
async def test_list_users_non_admin_forbidden(client: AsyncClient, db_session: AsyncSession):
    """Test non-admin cannot list users"""
    tenant = Tenant(id="tenant-2", name="Test Condo")
    morador = User(
        id="morador-1",
        email="morador@test.com",
        hashed_password=get_password_hash("pass123"),
        full_name="Morador User",
        role="morador",
        tenant_id="tenant-2",
        is_active=True
    )
    db_session.add_all([tenant, morador])
    await db_session.commit()
    
    token = create_access_token(morador.id, expires_delta=timedelta(hours=1))
    
    response = await client.get(
        "/api/v1/users/",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 403
    assert "Only admins can list users" in response.json()["detail"]


@pytest.mark.asyncio
async def test_list_users_as_admin(client: AsyncClient, db_session: AsyncSession):
    """Test admin can list all users in tenant"""
    tenant = Tenant(id="tenant-3", name="Test Condo")
    admin = User(
        id="admin-3",
        email="admin3@test.com",
        hashed_password=get_password_hash("pass123"),
        full_name="Admin 3",
        role="admin",
        tenant_id="tenant-3",
        is_active=True
    )
    user1 = User(
        id="user-3-1",
        email="user1@test.com",
        hashed_password=get_password_hash("pass123"),
        full_name="User 1",
        role="morador",
        tenant_id="tenant-3",
        is_active=True
    )
    user2 = User(
        id="user-3-2",
        email="user2@test.com",
        hashed_password=get_password_hash("pass123"),
        full_name="User 2",
        role="staff",
        tenant_id="tenant-3",
        is_active=True
    )
    db_session.add_all([tenant, admin, user1, user2])
    await db_session.commit()
    
    token = create_access_token(admin.id, expires_delta=timedelta(hours=1))
    
    response = await client.get(
        "/api/v1/users/",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3  # admin + 2 users


@pytest.mark.asyncio
async def test_get_current_user(client: AsyncClient, db_session: AsyncSession):
    """Test getting current user info"""
    tenant = Tenant(id="tenant-4", name="Test Condo")
    user = User(
        id="user-4",
        email="user4@test.com",
        hashed_password=get_password_hash("pass123"),
        full_name="User 4",
        role="morador",
        tenant_id="tenant-4",
        is_active=True
    )
    db_session.add_all([tenant, user])
    await db_session.commit()
    
    token = create_access_token(user.id, expires_delta=timedelta(hours=1))
    
    response = await client.get(
        "/api/v1/users/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "user4@test.com"
    assert data["full_name"] == "User 4"


@pytest.mark.asyncio
async def test_activate_user_as_admin(client: AsyncClient, db_session: AsyncSession):
    """Test admin can activate user"""
    tenant = Tenant(id="tenant-5", name="Test Condo")
    admin = User(
        id="admin-5",
        email="admin5@test.com",
        hashed_password=get_password_hash("pass123"),
        full_name="Admin 5",
        role="admin",
        tenant_id="tenant-5",
        is_active=True
    )
    inactive_user = User(
        id="inactive-5",
        email="inactive@test.com",
        hashed_password=get_password_hash("pass123"),
        full_name="Inactive User",
        role="morador",
        tenant_id="tenant-5",
        is_active=False
    )
    db_session.add_all([tenant, admin, inactive_user])
    await db_session.commit()
    
    token = create_access_token(admin.id, expires_delta=timedelta(hours=1))
    
    response = await client.put(
        "/api/v1/users/inactive-5/activate",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["is_active"] is True


@pytest.mark.asyncio
async def test_deactivate_user_as_admin(client: AsyncClient, db_session: AsyncSession):
    """Test admin can deactivate user"""
    tenant = Tenant(id="tenant-6", name="Test Condo")
    admin = User(
        id="admin-6",
        email="admin6@test.com",
        hashed_password=get_password_hash("pass123"),
        full_name="Admin 6",
        role="admin",
        tenant_id="tenant-6",
        is_active=True
    )
    active_user = User(
        id="active-6",
        email="active@test.com",
        hashed_password=get_password_hash("pass123"),
        full_name="Active User",
        role="morador",
        tenant_id="tenant-6",
        is_active=True
    )
    db_session.add_all([tenant, admin, active_user])
    await db_session.commit()
    
    token = create_access_token(admin.id, expires_delta=timedelta(hours=1))
    
    response = await client.put(
        "/api/v1/users/active-6/deactivate",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["is_active"] is False


@pytest.mark.asyncio
async def test_change_password_success(client: AsyncClient, db_session: AsyncSession):
    """Test user can change their own password"""
    tenant = Tenant(id="tenant-7", name="Test Condo")
    user = User(
        id="user-7",
        email="user7@test.com",
        hashed_password=get_password_hash("oldpass123"),
        full_name="User 7",
        role="morador",
        tenant_id="tenant-7",
        is_active=True
    )
    db_session.add_all([tenant, user])
    await db_session.commit()
    
    token = create_access_token(user.id, expires_delta=timedelta(hours=1))
    
    response = await client.put(
        "/api/v1/users/me/change-password",
        json={
            "current_password": "oldpass123",
            "new_password": "newpass456"
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "user7@test.com"
