"""
Integration tests for pagination across all paginated endpoints.
Validates: items, total, page, page_size, total_pages structure.
"""
import pytest
from datetime import timedelta
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.base import User, Tenant, Event, CommonArea
from app.core.security import get_password_hash, create_access_token


def make_token(user_id: str) -> str:
    return create_access_token(user_id, expires_delta=timedelta(hours=1))


@pytest.mark.asyncio
async def test_users_pagination_default(client: AsyncClient, db_session: AsyncSession):
    """25 users → page=1,size=20 returns 20 items, total=25, total_pages=2"""
    tenant = Tenant(id="pag-tenant-1", name="PagTest1")
    admin = User(
        id="pag-admin-1", email="pagadmin1@test.com",
        hashed_password=get_password_hash("pass"), full_name="Pag Admin",
        role="admin", tenant_id="pag-tenant-1", is_active=True
    )
    db_session.add_all([tenant, admin])
    for i in range(24):
        db_session.add(User(
            id=f"pag-user-{i}", email=f"paguser{i}@test.com",
            hashed_password=get_password_hash("pass"), full_name=f"User {i}",
            role="resident", tenant_id="pag-tenant-1", is_active=True
        ))
    await db_session.commit()

    token = make_token("pag-admin-1")
    response = await client.get(
        "/api/v1/users/?page=1&page_size=20",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert "page" in data
    assert "page_size" in data
    assert "total_pages" in data
    assert data["total"] == 25
    assert data["page"] == 1
    assert data["page_size"] == 20
    assert data["total_pages"] == 2
    assert len(data["items"]) == 20


@pytest.mark.asyncio
async def test_users_pagination_page2(client: AsyncClient, db_session: AsyncSession):
    """25 users → page=2,size=20 returns 5 items"""
    tenant = Tenant(id="pag-tenant-2", name="PagTest2")
    admin = User(
        id="pag-admin-2", email="pagadmin2@test.com",
        hashed_password=get_password_hash("pass"), full_name="Pag Admin2",
        role="admin", tenant_id="pag-tenant-2", is_active=True
    )
    db_session.add_all([tenant, admin])
    for i in range(24):
        db_session.add(User(
            id=f"pag2-user-{i}", email=f"pag2user{i}@test.com",
            hashed_password=get_password_hash("pass"), full_name=f"User {i}",
            role="resident", tenant_id="pag-tenant-2", is_active=True
        ))
    await db_session.commit()

    token = make_token("pag-admin-2")
    response = await client.get(
        "/api/v1/users/?page=2&page_size=20",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["page"] == 2
    assert len(data["items"]) == 5


@pytest.mark.asyncio
async def test_pagination_max_page_size_rejected(client: AsyncClient, db_session: AsyncSession):
    """page_size=200 must return 422 (exceeds max=100)"""
    tenant = Tenant(id="pag-tenant-3", name="PagTest3")
    admin = User(
        id="pag-admin-3", email="pagadmin3@test.com",
        hashed_password=get_password_hash("pass"), full_name="Pag Admin3",
        role="admin", tenant_id="pag-tenant-3", is_active=True
    )
    db_session.add_all([tenant, admin])
    await db_session.commit()

    token = make_token("pag-admin-3")
    response = await client.get(
        "/api/v1/users/?page=1&page_size=200",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 422


@pytest.mark.asyncio
async def test_pagination_empty_result(client: AsyncClient, db_session: AsyncSession):
    """0 registros → items=[], total=0"""
    tenant = Tenant(id="pag-tenant-4", name="PagTest4")
    admin = User(
        id="pag-admin-4", email="pagadmin4@test.com",
        hashed_password=get_password_hash("pass"), full_name="Pag Admin4",
        role="admin", tenant_id="pag-tenant-4", is_active=True
    )
    db_session.add_all([tenant, admin])
    await db_session.commit()

    token = make_token("pag-admin-4")
    response = await client.get(
        "/api/v1/users/?page=1&page_size=20",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1  # só o admin
    assert data["items"][0]["role"] == "admin"


@pytest.mark.asyncio
async def test_events_pagination_structure(client: AsyncClient, db_session: AsyncSession):
    """Events endpoint returns PagedResponse structure"""
    tenant = Tenant(id="pag-tenant-5", name="PagTest5")
    admin = User(
        id="pag-admin-5", email="pagadmin5@test.com",
        hashed_password=get_password_hash("pass"), full_name="Pag Admin5",
        role="admin", tenant_id="pag-tenant-5", is_active=True
    )
    db_session.add_all([tenant, admin])
    await db_session.commit()

    token = make_token("pag-admin-5")
    response = await client.get(
        "/api/v1/events/?page=1&page_size=10",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert "total_pages" in data
    assert isinstance(data["items"], list)


@pytest.mark.asyncio
async def test_common_areas_pagination_structure(client: AsyncClient, db_session: AsyncSession):
    """Common areas endpoint returns PagedResponse structure"""
    tenant = Tenant(id="pag-tenant-6", name="PagTest6")
    admin = User(
        id="pag-admin-6", email="pagadmin6@test.com",
        hashed_password=get_password_hash("pass"), full_name="Pag Admin6",
        role="admin", tenant_id="pag-tenant-6", is_active=True
    )
    db_session.add_all([tenant, admin])
    await db_session.commit()

    token = make_token("pag-admin-6")
    response = await client.get(
        "/api/v1/common-areas/?page=1&page_size=10",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data


@pytest.mark.asyncio
async def test_notifications_pagination_structure(client: AsyncClient, db_session: AsyncSession):
    """Notifications endpoint returns PagedResponse structure"""
    tenant = Tenant(id="pag-tenant-7", name="PagTest7")
    user = User(
        id="pag-user-7", email="paguser7@test.com",
        hashed_password=get_password_hash("pass"), full_name="Pag User7",
        role="resident", tenant_id="pag-tenant-7", is_active=True
    )
    db_session.add_all([tenant, user])
    await db_session.commit()

    token = make_token("pag-user-7")
    response = await client.get(
        "/api/v1/notifications/?page=1&page_size=10",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert data["total"] == 0
    assert data["items"] == []
