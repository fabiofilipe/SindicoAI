from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.dependencies.auth import get_current_user
from app.models.base import User, UserRole
from app.schemas.event import EventCreate, EventUpdate, EventResponse, EventRSVPCreate, EventRSVPResponse
from app.schemas.pagination import PagedResponse
from app.services.event_service import (
    list_events, get_event, create_event, update_event, cancel_event,
    create_or_update_rsvp, get_my_rsvp, list_event_rsvps, mark_attendance,
)

router = APIRouter()


@router.get("/", response_model=PagedResponse[EventResponse])
async def list_events_endpoint(
    status_filter: Optional[str] = Query(None, alias="status"),
    upcoming: Optional[bool] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await list_events(db, current_user.tenant_id, page, page_size, status_filter, upcoming)


@router.post("/", response_model=EventResponse, status_code=status.HTTP_201_CREATED)
async def create_event_endpoint(
    event: EventCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only admins can create events")
    return await create_event(db, event, current_user)


@router.get("/{event_id}", response_model=EventResponse)
async def get_event_endpoint(
    event_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await get_event(db, event_id, current_user.tenant_id)


@router.put("/{event_id}", response_model=EventResponse)
async def update_event_endpoint(
    event_id: str,
    event_update: EventUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only admins can update events")
    return await update_event(db, event_id, current_user.tenant_id, event_update.model_dump(exclude_unset=True))


@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
async def cancel_event_endpoint(
    event_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only admins can cancel events")
    await cancel_event(db, event_id, current_user.tenant_id)


@router.post("/{event_id}/rsvp", response_model=EventRSVPResponse)
async def create_or_update_rsvp_endpoint(
    event_id: str,
    rsvp_data: EventRSVPCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role == UserRole.STAFF:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Staff members cannot RSVP to events")
    return await create_or_update_rsvp(db, event_id, current_user, rsvp_data.response)


@router.get("/{event_id}/my-rsvp", response_model=EventRSVPResponse)
async def get_my_rsvp_endpoint(
    event_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await get_my_rsvp(db, event_id, current_user)


@router.get("/{event_id}/rsvps", response_model=List[EventRSVPResponse])
async def list_event_rsvps_endpoint(
    event_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role not in [UserRole.ADMIN, UserRole.STAFF]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only admins and staff can view RSVPs")
    return await list_event_rsvps(db, event_id, current_user.tenant_id)


@router.put("/rsvps/{rsvp_id}/attendance", response_model=EventRSVPResponse)
async def mark_attendance_endpoint(
    rsvp_id: str,
    attended: bool = Query(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role not in [UserRole.ADMIN, UserRole.STAFF]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only admins and staff can mark attendance")
    return await mark_attendance(db, rsvp_id, current_user.tenant_id, attended)
