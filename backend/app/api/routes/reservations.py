from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.database import get_db
from app.dependencies.auth import get_current_user
from app.models.base import Reservation, User
from app.schemas.reservation import ReservationCreate, ReservationResponse
from app.services.reservation_service import check_reservation_conflict, check_unit_limit

router = APIRouter()

@router.get("/", response_model=List[ReservationResponse])
async def list_reservations(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List all reservations for the current tenant"""
    result = await db.execute(
        select(Reservation).where(Reservation.tenant_id == current_user.tenant_id)
    )
    reservations = result.scalars().all()
    return reservations

@router.post("/", response_model=ReservationResponse, status_code=status.HTTP_201_CREATED)
async def create_reservation(
    reservation: ReservationCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new reservation with conflict checking"""
    # Check for time conflicts
    has_conflict = await check_reservation_conflict(
        db=db,
        common_area_id=reservation.common_area_id,
        start_time=reservation.start_time,
        end_time=reservation.end_time,
        tenant_id=current_user.tenant_id
    )
    
    if has_conflict:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Time slot already reserved"
        )
    
    # Check unit limit
    if current_user.unit_id:
        limit_exceeded = await check_unit_limit(
            db=db,
            unit_id=current_user.unit_id,
            start_time=reservation.start_time,
            end_time=reservation.end_time,
            tenant_id=current_user.tenant_id
        )
        
        if limit_exceeded:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unit has reached maximum concurrent reservations"
            )
    
    db_reservation = Reservation(
        **reservation.model_dump(),
        user_id=current_user.id,
        unit_id=current_user.unit_id,
        tenant_id=current_user.tenant_id
    )
    db.add(db_reservation)
    await db.commit()
    await db.refresh(db_reservation)
    return db_reservation

@router.get("/{reservation_id}", response_model=ReservationResponse)
async def get_reservation(
    reservation_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific reservation"""
    result = await db.execute(
        select(Reservation).where(
            Reservation.id == reservation_id,
            Reservation.tenant_id == current_user.tenant_id
        )
    )
    reservation = result.scalars().first()
    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")
    return reservation

@router.delete("/{reservation_id}", status_code=status.HTTP_204_NO_CONTENT)
async def cancel_reservation(
    reservation_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Cancel a reservation"""
    result = await db.execute(
        select(Reservation).where(
            Reservation.id == reservation_id,
            Reservation.tenant_id == current_user.tenant_id
        )
    )
    reservation = result.scalars().first()
    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")
    
    reservation.status = "cancelled"
    await db.commit()
    return None
