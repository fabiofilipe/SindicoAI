import pytest
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession

from app.services.reservation_service import check_reservation_conflict, check_unit_limit
from app.models.base import Reservation, CommonArea, Tenant, User, Unit

@pytest.mark.asyncio
async def test_reservation_conflict_overlapping_times(db: AsyncSession):
    """Test that overlapping reservations are detected"""
    # Setup
    tenant = Tenant(id="tenant1", name="Test Condo")
    area = CommonArea(id="area1", name="Pool", tenant_id="tenant1")
    
    # Create existing reservation
    existing = Reservation(
        id="res1",
        common_area_id="area1",
        start_time=datetime(2024, 1, 1, 10, 0),
        end_time=datetime(2024, 1, 1, 12, 0),
        user_id="user1",
        unit_id="unit1",
        tenant_id="tenant1",
        status="confirmed"
    )
    
    db.add_all([tenant, area, existing])
    await db.commit()
    
    # Test overlapping time
    has_conflict = await check_reservation_conflict(
        db=db,
        common_area_id="area1",
        start_time=datetime(2024, 1, 1, 11, 0),
        end_time=datetime(2024, 1, 1, 13, 0),
        tenant_id="tenant1"
    )
    
    assert has_conflict is True

@pytest.mark.asyncio
async def test_reservation_no_conflict_different_areas(db: AsyncSession):
    """Test that same time, different areas don't conflict"""
    # Setup
    tenant = Tenant(id="tenant1", name="Test Condo")
    area1 = CommonArea(id="area1", name="Pool", tenant_id="tenant1")
    area2 = CommonArea(id="area2", name="Gym", tenant_id="tenant1")
    
    # Create existing reservation for area1
    existing = Reservation(
        id="res1",
        common_area_id="area1",
        start_time=datetime(2024, 1, 1, 10, 0),
        end_time=datetime(2024, 1, 1, 12, 0),
        user_id="user1",
        unit_id="unit1",
        tenant_id="tenant1",
        status="confirmed"
    )
    
    db.add_all([tenant, area1, area2, existing])
    await db.commit()
    
    # Test same time but different area
    has_conflict = await check_reservation_conflict(
        db=db,
        common_area_id="area2",
        start_time=datetime(2024, 1, 1, 10, 0),
        end_time=datetime(2024, 1, 1, 12, 0),
        tenant_id="tenant1"
    )
    
    assert has_conflict is False

@pytest.mark.asyncio
async def test_reservation_no_conflict_different_times(db: AsyncSession):
    """Test that non-overlapping times don't conflict"""
    # Setup
    tenant = Tenant(id="tenant1", name="Test Condo")
    area = CommonArea(id="area1", name="Pool", tenant_id="tenant1")
    
    # Create existing reservation
    existing = Reservation(
        id="res1",
        common_area_id="area1",
        start_time=datetime(2024, 1, 1, 10, 0),
        end_time=datetime(2024, 1, 1, 12, 0),
        user_id="user1",
        unit_id="unit1",
        tenant_id="tenant1",
        status="confirmed"
    )
    
    db.add_all([tenant, area, existing])
    await db.commit()
    
    # Test non-overlapping time (after)
    has_conflict = await check_reservation_conflict(
        db=db,
        common_area_id="area1",
        start_time=datetime(2024, 1, 1, 12, 0),
        end_time=datetime(2024, 1, 1, 14, 0),
        tenant_id="tenant1"
    )
    
    assert has_conflict is False

@pytest.mark.asyncio
async def test_unit_limit_exceeded(db: AsyncSession):
    """Test that unit reservation limit is enforced"""
    # Setup
    tenant = Tenant(id="tenant1", name="Test Condo")
    unit = Unit(id="unit1", number="101", tenant_id="tenant1")
    area1 = CommonArea(id="area1", name="Pool", tenant_id="tenant1")
    area2 = CommonArea(id="area2", name="Gym", tenant_id="tenant1")
    
    # Create 2 existing reservations for the same unit
    res1 = Reservation(
        id="res1",
        common_area_id="area1",
        start_time=datetime(2024, 1, 1, 10, 0),
        end_time=datetime(2024, 1, 1, 12, 0),
        user_id="user1",
        unit_id="unit1",
        tenant_id="tenant1",
        status="confirmed"
    )
    
    res2 = Reservation(
        id="res2",
        common_area_id="area2",
        start_time=datetime(2024, 1, 1, 10, 0),
        end_time=datetime(2024, 1, 1, 12, 0),
        user_id="user1",
        unit_id="unit1",
        tenant_id="tenant1",
        status="confirmed"
    )
    
    db.add_all([tenant, unit, area1, area2, res1, res2])
    await db.commit()
    
    # Test if limit is exceeded (default max is 2)
    limit_exceeded = await check_unit_limit(
        db=db,
        unit_id="unit1",
        start_time=datetime(2024, 1, 1, 11, 0),
        end_time=datetime(2024, 1, 1, 13, 0),
        tenant_id="tenant1",
        max_reservations=2
    )
    
    assert limit_exceeded is True

@pytest.mark.asyncio
async def test_cancelled_reservations_dont_conflict(db: AsyncSession):
    """Test that cancelled reservations don't cause conflicts"""
    # Setup
    tenant = Tenant(id="tenant1", name="Test Condo")
    area = CommonArea(id="area1", name="Pool", tenant_id="tenant1")
    
    # Create cancelled reservation
    existing = Reservation(
        id="res1",
        common_area_id="area1",
        start_time=datetime(2024, 1, 1, 10, 0),
        end_time=datetime(2024, 1, 1, 12, 0),
        user_id="user1",
        unit_id="unit1",
        tenant_id="tenant1",
        status="cancelled"
    )
    
    db.add_all([tenant, area, existing])
    await db.commit()
    
    # Test overlapping time with cancelled reservation
    has_conflict = await check_reservation_conflict(
        db=db,
        common_area_id="area1",
        start_time=datetime(2024, 1, 1, 11, 0),
        end_time=datetime(2024, 1, 1, 13, 0),
        tenant_id="tenant1"
    )
    
    assert has_conflict is False
