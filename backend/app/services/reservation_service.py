from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import and_
from datetime import datetime
from typing import Optional

from app.models.base import Reservation

async def check_reservation_conflict(
    db: AsyncSession,
    common_area_id: str,
    start_time: datetime,
    end_time: datetime,
    tenant_id: str,
    exclude_reservation_id: Optional[str] = None
) -> bool:
    """
    Check if there's a time conflict for a reservation.
    Returns True if conflict exists, False otherwise.
    """
    query = select(Reservation).where(
        and_(
            Reservation.common_area_id == common_area_id,
            Reservation.tenant_id == tenant_id,
            Reservation.status == "confirmed",
            # Check for time overlap
            Reservation.start_time < end_time,
            Reservation.end_time > start_time
        )
    )
    
    if exclude_reservation_id:
        query = query.where(Reservation.id != exclude_reservation_id)
    
    result = await db.execute(query)
    conflicts = result.scalars().all()
    
    return len(conflicts) > 0

async def check_unit_limit(
    db: AsyncSession,
    unit_id: str,
    start_time: datetime,
    end_time: datetime,
    tenant_id: str,
    max_reservations: int = 2
) -> bool:
    """
    Check if unit has exceeded reservation limit for the time period.
    Returns True if limit exceeded, False otherwise.
    """
    query = select(Reservation).where(
        and_(
            Reservation.unit_id == unit_id,
            Reservation.tenant_id == tenant_id,
            Reservation.status == "confirmed",
            # Check for overlapping time period
            Reservation.start_time < end_time,
            Reservation.end_time > start_time
        )
    )
    
    result = await db.execute(query)
    reservations = result.scalars().all()
    
    return len(reservations) >= max_reservations
