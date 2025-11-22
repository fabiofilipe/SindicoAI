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
    """Create a new reservation with conflict checking (residents and admins only)"""
    # Staff cannot create reservations
    if current_user.role == "staff":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Staff members cannot create reservations"
        )
    
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
    """Cancel a reservation (owner or admin only)"""
    result = await db.execute(
        select(Reservation).where(
            Reservation.id == reservation_id,
            Reservation.tenant_id == current_user.tenant_id
        )
    )
    reservation = result.scalars().first()
    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")
    
    # Only owner or admin can cancel
    if current_user.role != "admin" and reservation.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only cancel your own reservations"
        )
    
    reservation.status = "cancelled"
    await db.commit()
    return None


@router.put("/{reservation_id}/start", response_model=ReservationResponse)
async def start_reservation(
    reservation_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mark reservation as started (staff only)"""
    # Only staff can start reservations
    if current_user.role != "staff":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only staff members can start reservations"
        )
    
    result = await db.execute(
        select(Reservation).where(
            Reservation.id == reservation_id,
            Reservation.tenant_id == current_user.tenant_id
        )
    )
    reservation = result.scalars().first()
    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")
    
    # Can only start confirmed reservations
    if reservation.status != "confirmed":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot start reservation with status: {reservation.status}"
        )
    
    reservation.status = "in-progress"
    await db.commit()
    await db.refresh(reservation)
    return reservation

@router.put("/{reservation_id}/complete", response_model=ReservationResponse)
async def complete_reservation(
    reservation_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mark reservation as completed (staff only)"""
    # Only staff can complete reservations
    if current_user.role != "staff":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only staff members can complete reservations"
        )
    
    result = await db.execute(
        select(Reservation).where(
            Reservation.id == reservation_id,
            Reservation.tenant_id == current_user.tenant_id
        )
    )
    reservation = result.scalars().first()
    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")
    
    # Can only complete in-progress reservations
    if reservation.status != "in-progress":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot complete reservation with status: {reservation.status}"
        )
    
    reservation.status = "completed"
    await db.commit()
    await db.refresh(reservation)
    return reservation

@router.post("/{reservation_id}/report-issue", status_code=status.HTTP_201_CREATED)
async def report_reservation_issue(
    reservation_id: str,
    issue: dict,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Report an issue with a reservation (staff only)"""
    # Only staff can report issues
    if current_user.role != "staff":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only staff members can report issues"
        )
    
    result = await db.execute(
        select(Reservation).where(
            Reservation.id == reservation_id,
            Reservation.tenant_id == current_user.tenant_id
        )
    )
    reservation = result.scalars().first()
    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")
    
    # Create notification for admins about the issue
    from app.models.base import Notification
    
    description = issue.get("description", "Issue reported")
    severity = issue.get("severity", "normal")
    
    # Get all admins in the tenant
    admin_result = await db.execute(
        select(User).where(
            User.tenant_id == current_user.tenant_id,
            User.role == "admin"
        )
    )
    admins = admin_result.scalars().all()
    
    # Create notification for each admin
    for admin in admins:
        notification = Notification(
            user_id=admin.id,
            title=f"Problema Reportado - Reserva #{reservation_id[:8]}",
            message=f"Funcionário {current_user.full_name} reportou: {description} (Severidade: {severity})",
            tenant_id=current_user.tenant_id
        )
        db.add(notification)
    
    await db.commit()
    
    return {"message": "Issue reported successfully", "notifications_created": len(admins)}
