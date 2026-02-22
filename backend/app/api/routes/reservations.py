from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.dependencies.auth import get_current_user, require_staff
from app.models.base import User
from app.schemas.pagination import PagedResponse
from app.schemas.reservation import ReservationCreate, ReservationResponse
from app.services.reservation_service import (
    list_reservations, get_reservation, create_reservation,
    cancel_reservation, update_reservation_status, report_reservation_issue,
)

router = APIRouter()


@router.get("/", response_model=PagedResponse[ReservationResponse])
async def list_reservations_endpoint(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await list_reservations(db, current_user.tenant_id, page, page_size)


@router.post("/", response_model=ReservationResponse, status_code=status.HTTP_201_CREATED)
async def create_reservation_endpoint(
    reservation: ReservationCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await create_reservation(db, reservation.model_dump(), current_user)


@router.get("/{reservation_id}", response_model=ReservationResponse)
async def get_reservation_endpoint(
    reservation_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await get_reservation(db, reservation_id, current_user.tenant_id)


@router.delete("/{reservation_id}", status_code=status.HTTP_204_NO_CONTENT)
async def cancel_reservation_endpoint(
    reservation_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    await cancel_reservation(db, reservation_id, current_user)


@router.put("/{reservation_id}/start", response_model=ReservationResponse)
async def start_reservation(
    reservation_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_staff),
):
    return await update_reservation_status(
        db, reservation_id, current_user.tenant_id,
        new_status="in-progress", allowed_current_status="confirmed",
    )


@router.put("/{reservation_id}/complete", response_model=ReservationResponse)
async def complete_reservation(
    reservation_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_staff),
):
    return await update_reservation_status(
        db, reservation_id, current_user.tenant_id,
        new_status="completed", allowed_current_status="in-progress",
    )


@router.post("/{reservation_id}/report-issue", status_code=status.HTTP_201_CREATED)
async def report_issue(
    reservation_id: str,
    issue: dict,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_staff),
):
    return await report_reservation_issue(
        db, reservation_id, current_user,
        description=issue.get("description", "Issue reported"),
        severity=issue.get("severity", "normal"),
    )
