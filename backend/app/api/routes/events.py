from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import and_, func, or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from datetime import datetime

from app.core.database import get_db
from app.dependencies.auth import get_current_user
from app.models.base import Event, EventRSVP, User, Notification, UserRole
from app.schemas.event import EventCreate, EventUpdate, EventResponse, EventRSVPCreate, EventRSVPResponse
from app.schemas.pagination import PagedResponse
from app.services.event_service import check_capacity, get_user_rsvp, count_attendees, get_attendee_counts

router = APIRouter()


@router.get("/", response_model=PagedResponse[EventResponse])
async def list_events(
    status_filter: Optional[str] = Query(None, alias="status"),
    upcoming: Optional[bool] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List all events for the current tenant"""
    base_query = select(Event).where(Event.tenant_id == current_user.tenant_id)

    if status_filter:
        base_query = base_query.where(Event.status == status_filter)
    if upcoming is True:
        base_query = base_query.where(Event.event_date >= datetime.utcnow())
    elif upcoming is False:
        base_query = base_query.where(Event.event_date < datetime.utcnow())

    total = await db.scalar(select(func.count()).select_from(base_query.subquery()))

    base_query = (
        base_query
        .options(selectinload(Event.common_area))
        .order_by(Event.event_date.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    result = await db.execute(base_query)
    events = result.scalars().all()

    # Single query for all attendee counts — eliminates N+1
    counts = await get_attendee_counts(db, current_user.tenant_id, [e.id for e in events])
    items = []
    for event in events:
        r = EventResponse.model_validate(event)
        r.attendee_count = counts.get(event.id, 0)
        items.append(r)

    return PagedResponse.build(items=items, total=total, page=page, page_size=page_size)


@router.post("/", response_model=EventResponse, status_code=status.HTTP_201_CREATED)
async def create_event(
    event: EventCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new event (admin only)"""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can create events"
        )

    if event.end_time <= event.start_time:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="End time must be after start time"
        )

    db_event = Event(
        **event.model_dump(),
        created_by=current_user.id,
        tenant_id=current_user.tenant_id
    )
    db.add(db_event)
    await db.commit()
    await db.refresh(db_event)

    # Notify all residents
    result = await db.execute(
        select(User).where(
            User.tenant_id == current_user.tenant_id,
            User.role == UserRole.RESIDENT
        )
    )
    residents = result.scalars().all()

    for resident in residents:
        db.add(Notification(
            user_id=resident.id,
            title=f"Novo Evento: {db_event.title}",
            message=f"Participe! {db_event.title} em {db_event.event_date.strftime('%d/%m/%Y às %H:%M')}",
            tenant_id=current_user.tenant_id
        ))

    await db.commit()

    event_response = EventResponse.model_validate(db_event)
    event_response.attendee_count = 0
    return event_response


@router.get("/{event_id}", response_model=EventResponse)
async def get_event(
    event_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific event"""
    result = await db.execute(
        select(Event).where(
            Event.id == event_id,
            Event.tenant_id == current_user.tenant_id
        )
    )
    event = result.scalar_one_or_none()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    counts = await get_attendee_counts(db, current_user.tenant_id, [event.id])
    event_response = EventResponse.model_validate(event)
    event_response.attendee_count = counts.get(event.id, 0)
    return event_response


@router.put("/{event_id}", response_model=EventResponse)
async def update_event(
    event_id: str,
    event_update: EventUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update an event (admin only)"""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can update events"
        )

    result = await db.execute(
        select(Event).where(
            Event.id == event_id,
            Event.tenant_id == current_user.tenant_id
        )
    )
    db_event = result.scalar_one_or_none()
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")

    for field, value in event_update.model_dump(exclude_unset=True).items():
        setattr(db_event, field, value)

    await db.commit()
    await db.refresh(db_event)

    # Notify attendees about update
    rsvp_result = await db.execute(
        select(EventRSVP).where(
            EventRSVP.event_id == event_id,
            EventRSVP.tenant_id == current_user.tenant_id,
            EventRSVP.response == "attending"
        )
    )
    for rsvp in rsvp_result.scalars().all():
        db.add(Notification(
            user_id=rsvp.user_id,
            title=f"Evento Atualizado: {db_event.title}",
            message=f"O evento {db_event.title} foi atualizado. Confira os detalhes!",
            tenant_id=current_user.tenant_id
        ))

    await db.commit()

    counts = await get_attendee_counts(db, current_user.tenant_id, [db_event.id])
    event_response = EventResponse.model_validate(db_event)
    event_response.attendee_count = counts.get(db_event.id, 0)
    return event_response


@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
async def cancel_event(
    event_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Cancel an event (admin only, soft delete)"""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can cancel events"
        )

    result = await db.execute(
        select(Event).where(
            Event.id == event_id,
            Event.tenant_id == current_user.tenant_id
        )
    )
    db_event = result.scalar_one_or_none()
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")

    db_event.status = "cancelled"
    await db.commit()

    # Notify attendees about cancellation
    rsvp_result = await db.execute(
        select(EventRSVP).where(
            EventRSVP.event_id == event_id,
            EventRSVP.tenant_id == current_user.tenant_id,
            EventRSVP.response == "attending"
        )
    )
    for rsvp in rsvp_result.scalars().all():
        db.add(Notification(
            user_id=rsvp.user_id,
            title=f"Evento Cancelado: {db_event.title}",
            message=f"O evento {db_event.title} foi cancelado.",
            tenant_id=current_user.tenant_id
        ))

    await db.commit()
    return None


@router.post("/{event_id}/rsvp", response_model=EventRSVPResponse)
async def create_or_update_rsvp(
    event_id: str,
    rsvp_data: EventRSVPCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create or update RSVP (residents only)"""
    if current_user.role == UserRole.STAFF:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Staff members cannot RSVP to events"
        )

    result = await db.execute(
        select(Event).where(
            Event.id == event_id,
            Event.tenant_id == current_user.tenant_id
        )
    )
    event = result.scalar_one_or_none()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    if event.status == "cancelled":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot RSVP to a cancelled event"
        )

    if rsvp_data.response == "attending":
        is_full = await check_capacity(db, event_id, current_user.tenant_id)
        if is_full:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Event is at full capacity"
            )

    existing_rsvp = await get_user_rsvp(db, event_id, current_user.id, current_user.tenant_id)

    if existing_rsvp:
        existing_rsvp.response = rsvp_data.response
        await db.commit()
        await db.refresh(existing_rsvp)
        return existing_rsvp
    else:
        db_rsvp = EventRSVP(
            event_id=event_id,
            user_id=current_user.id,
            response=rsvp_data.response,
            tenant_id=current_user.tenant_id
        )
        db.add(db_rsvp)
        await db.commit()
        await db.refresh(db_rsvp)
        return db_rsvp


@router.get("/{event_id}/my-rsvp", response_model=EventRSVPResponse)
async def get_my_rsvp(
    event_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get current user's RSVP for an event"""
    rsvp = await get_user_rsvp(db, event_id, current_user.id, current_user.tenant_id)
    if not rsvp:
        raise HTTPException(status_code=404, detail="RSVP not found")
    return rsvp


@router.get("/{event_id}/rsvps", response_model=List[EventRSVPResponse])
async def list_event_rsvps(
    event_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List all RSVPs for an event (admin only)"""
    if current_user.role not in [UserRole.ADMIN, UserRole.STAFF]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins and staff can view RSVPs"
        )

    result = await db.execute(
        select(EventRSVP).where(
            EventRSVP.event_id == event_id,
            EventRSVP.tenant_id == current_user.tenant_id
        )
    )
    return result.scalars().all()


@router.put("/rsvps/{rsvp_id}/attendance", response_model=EventRSVPResponse)
async def mark_attendance(
    rsvp_id: str,
    attended: bool = Query(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mark attendance for an RSVP (staff and admin only)"""
    if current_user.role not in [UserRole.ADMIN, UserRole.STAFF]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins and staff can mark attendance"
        )

    result = await db.execute(
        select(EventRSVP).where(
            EventRSVP.id == rsvp_id,
            EventRSVP.tenant_id == current_user.tenant_id
        )
    )
    rsvp = result.scalar_one_or_none()
    if not rsvp:
        raise HTTPException(status_code=404, detail="RSVP not found")

    rsvp.attended = attended
    await db.commit()
    await db.refresh(rsvp)
    return rsvp
