"""
Integration tests for reservation endpoints
Tests CRUD operations with different user roles
"""
import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timedelta

from app.models.base import User, Tenant, CommonArea, Unit
from app.core.security import get_password_hash, create_access_token


@pytest.mark.asyncio
async def test_create_reservation_success(client: AsyncClient, db_session: AsyncSession):
    """Test creating a reservation as morador"""
    # Setup data
    tenant = Tenant(id="tenant-1", name="Test Condo")
    unit = Unit(id="unit-1", number="101", tenant_id="tenant-1")
    area = CommonArea(
        id="area-1",
        name="Pool",
        description="Swimming pool",
        tenant_id="tenant-1"
    )
    user = User(
        id="user-1",
        email="morador@test.com",
        hashed_password=get_password_hash("pass123"),
        full_name="Morador Test",
        role="morador",
        tenant_id="tenant-1",
        unit_id="unit-1",
        is_active=True
    )
    db_session.add_all([tenant, unit, area, user])
    await db_session.commit()
    
    # Create token
    token = create_access_token(user.id, expires_delta=timedelta(hours=1))
    
    # Create reservation
    tomorrow = datetime.now() + timedelta(days=1)
    response = await client.post(
        "/api/v1/reservations/",
        json={
            "common_area_id": "area-1",
            "start_time": tomorrow.replace(hour=10, minute=0).isoformat(),
            "end_time": tomorrow.replace(hour=12, minute=0).isoformat(),
            "status": "pending"
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 201
    data = response.json()
    assert data["common_area_id"] == "area-1"
    assert data["user_id"] == "user-1"
    assert data["status"] == "confirmed"


@pytest.mark.asyncio
async def test_create_reservation_staff_forbidden(client: AsyncClient, db_session: AsyncSession):
    """Test that staff cannot create reservations"""
    tenant = Tenant(id="tenant-2", name="Test Condo")
    area = CommonArea(id="area-2", name="Gym", tenant_id="tenant-2")
    staff = User(
        id="staff-1",
        email="staff@test.com",
        hashed_password=get_password_hash("pass123"),
        full_name="Staff Test",
        role="staff",
        tenant_id="tenant-2",
        is_active=True
    )
    db_session.add_all([tenant, area, staff])
    await db_session.commit()
    
    token = create_access_token(staff.id, expires_delta=timedelta(hours=1))
    
    tomorrow = datetime.now() + timedelta(days=1)
    response = await client.post(
        "/api/v1/reservations/",
        json={
            "common_area_id": "area-2",
            "start_time": tomorrow.replace(hour=14, minute=0).isoformat(),
            "end_time": tomorrow.replace(hour=16, minute=0).isoformat(),
            "status": "pending"
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 403
    assert "Staff members cannot create reservations" in response.json()["detail"]


@pytest.mark.asyncio
async def test_list_reservations(client: AsyncClient, db_session: AsyncSession):
    """Test listing reservations for tenant"""
    from app.models.base import Reservation
    
    tenant = Tenant(id="tenant-3", name="Test Condo")
    unit = Unit(id="unit-3", number="102", tenant_id="tenant-3")
    area = CommonArea(id="area-3", name="BBQ", tenant_id="tenant-3")
    user = User(
        id="user-3",
        email="user3@test.com",
        hashed_password=get_password_hash("pass123"),
        full_name="User 3",
        role="morador",
        tenant_id="tenant-3",
        unit_id="unit-3",
        is_active=True
    )
    
    tomorrow = datetime.now() + timedelta(days=1)
    reservation = Reservation(
        id="res-1",
        common_area_id="area-3",
        user_id="user-3",
        unit_id="unit-3",
        tenant_id="tenant-3",
        start_time=tomorrow.replace(hour=10, minute=0),
        end_time=tomorrow.replace(hour=12, minute=0),
        status="confirmed"
    )
    
    db_session.add_all([tenant, unit, area, user, reservation])
    await db_session.commit()
    
    token = create_access_token(user.id, expires_delta=timedelta(hours=1))
    
    response = await client.get(
        "/api/v1/reservations/",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["id"] == "res-1"


@pytest.mark.asyncio
async def test_cancel_reservation_owner(client: AsyncClient, db_session: AsyncSession):
    """Test owner can cancel their reservation"""
    from app.models.base import Reservation
    
    tenant = Tenant(id="tenant-4", name="Test Condo")
    unit = Unit(id="unit-4", number="103", tenant_id="tenant-4")
    area = CommonArea(id="area-4", name="Party Room", tenant_id="tenant-4")
    user = User(
        id="user-4",
        email="user4@test.com",
        hashed_password=get_password_hash("pass123"),
        full_name="User 4",
        role="morador",
        tenant_id="tenant-4",
        unit_id="unit-4",
        is_active=True
    )
    
    tomorrow = datetime.now() + timedelta(days=1)
    reservation = Reservation(
        id="res-2",
        common_area_id="area-4",
        user_id="user-4",
        unit_id="unit-4",
        tenant_id="tenant-4",
        start_time=tomorrow.replace(hour=18, minute=0),
        end_time=tomorrow.replace(hour=22, minute=0),
        status="confirmed"
    )
    
    db_session.add_all([tenant, unit, area, user, reservation])
    await db_session.commit()
    
    token = create_access_token(user.id, expires_delta=timedelta(hours=1))
    
    response = await client.delete(
        "/api/v1/reservations/res-2",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 204


@pytest.mark.asyncio
async def test_cancel_reservation_forbidden(client: AsyncClient, db_session: AsyncSession):
    """Test user cannot cancel someone else's reservation"""
    from app.models.base import Reservation
    
    tenant = Tenant(id="tenant-5", name="Test Condo")
    unit1 = Unit(id="unit-5a", number="104", tenant_id="tenant-5")
    unit2 = Unit(id="unit-5b", number="105", tenant_id="tenant-5")
    area = CommonArea(id="area-5", name="Gym", tenant_id="tenant-5")
    
    owner = User(
        id="owner-5",
        email="owner@test.com",
        hashed_password=get_password_hash("pass123"),
        full_name="Owner",
        role="morador",
        tenant_id="tenant-5",
        unit_id="unit-5a",
        is_active=True
    )
    
    other_user = User(
        id="other-5",
        email="other@test.com",
        hashed_password=get_password_hash("pass123"),
        full_name="Other User",
        role="morador",
        tenant_id="tenant-5",
        unit_id="unit-5b",
        is_active=True
    )
    
    tomorrow = datetime.now() + timedelta(days=1)
    reservation = Reservation(
        id="res-3",
        common_area_id="area-5",
        user_id="owner-5",
        unit_id="unit-5a",
        tenant_id="tenant-5",
        start_time=tomorrow.replace(hour=8, minute=0),
        end_time=tomorrow.replace(hour=10, minute=0),
        status="confirmed"
    )
    
    db_session.add_all([tenant, unit1, unit2, area, owner, other_user, reservation])
    await db_session.commit()
    
    # Try to cancel with other user's token
    token = create_access_token(other_user.id, expires_delta=timedelta(hours=1))
    
    response = await client.delete(
        "/api/v1/reservations/res-3",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 403
    assert "You can only cancel your own reservations" in response.json()["detail"]


@pytest.mark.asyncio
async def test_staff_start_reservation(client: AsyncClient, db_session: AsyncSession):
    """Test staff can start a confirmed reservation"""
    from app.models.base import Reservation
    
    tenant = Tenant(id="tenant-6", name="Test Condo")
    unit = Unit(id="unit-6", number="106", tenant_id="tenant-6")
    area = CommonArea(id="area-6", name="Pool", tenant_id="tenant-6")
    
    morador = User(
        id="morador-6",
        email="morador6@test.com",
        hashed_password=get_password_hash("pass123"),
        full_name="Morador 6",
        role="morador",
        tenant_id="tenant-6",
        unit_id="unit-6",
        is_active=True
    )
    
    staff = User(
        id="staff-6",
        email="staff6@test.com",
        hashed_password=get_password_hash("pass123"),
        full_name="Staff 6",
        role="staff",
        tenant_id="tenant-6",
        is_active=True
    )
    
    now = datetime.now()
    reservation = Reservation(
        id="res-4",
        common_area_id="area-6",
        user_id="morador-6",
        unit_id="unit-6",
        tenant_id="tenant-6",
        start_time=now - timedelta(minutes=5),
        end_time=now + timedelta(hours=2),
        status="confirmed"
    )
    
    db_session.add_all([tenant, unit, area, morador, staff, reservation])
    await db_session.commit()
    
    token = create_access_token(staff.id, expires_delta=timedelta(hours=1))
    
    response = await client.put(
        "/api/v1/reservations/res-4/start",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "in-progress"


@pytest.mark.asyncio
async def test_staff_complete_reservation(client: AsyncClient, db_session: AsyncSession):
    """Test staff can complete an in-progress reservation"""
    from app.models.base import Reservation
    
    tenant = Tenant(id="tenant-7", name="Test Condo")
    unit = Unit(id="unit-7", number="107", tenant_id="tenant-7")
    area = CommonArea(id="area-7", name="Gym", tenant_id="tenant-7")
    
    morador = User(
        id="morador-7",
        email="morador7@test.com",
        hashed_password=get_password_hash("pass123"),
        full_name="Morador 7",
        role="morador",
        tenant_id="tenant-7",
        unit_id="unit-7",
        is_active=True
    )
    
    staff = User(
        id="staff-7",
        email="staff7@test.com",
        hashed_password=get_password_hash("pass123"),
        full_name="Staff 7",
        role="staff",
        tenant_id="tenant-7",
        is_active=True
    )
    
    now = datetime.now()
    reservation = Reservation(
        id="res-5",
        common_area_id="area-7",
        user_id="morador-7",
        unit_id="unit-7",
        tenant_id="tenant-7",
        start_time=now - timedelta(hours=2),
        end_time=now - timedelta(minutes=5),
        status="in-progress"
    )
    
    db_session.add_all([tenant, unit, area, morador, staff, reservation])
    await db_session.commit()
    
    token = create_access_token(staff.id, expires_delta=timedelta(hours=1))
    
    response = await client.put(
        "/api/v1/reservations/res-5/complete",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "completed"
