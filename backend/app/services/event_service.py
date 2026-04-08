from sqlalchemy.ext.asyncio import AsyncSession
from app.models.base import Event, EventRSVP, User
from app.repositories.event import EventRepository, EventRSVPRepository
from app.repositories.notification import NotificationRepository
from app.repositories.user import UserRepository
from app.schemas.event import EventCreate, EventResponse
from app.schemas.pagination import PagedResponse
from app.exceptions import NotFoundError, ValidationError
from typing import Optional


async def list_events(
    db: AsyncSession,
    tenant_id: str,
    page: int,
    page_size: int,
    status_filter: Optional[str] = None,
    upcoming: Optional[bool] = None,
) -> PagedResponse:
    repo = EventRepository(db)
    rsvp_repo = EventRSVPRepository(db)

    events, total = await repo.list_with_filters(tenant_id, page, page_size, status_filter, upcoming)
    counts = await rsvp_repo.get_attendee_counts(tenant_id, [e.id for e in events])

    items = []
    for event in events:
        r = EventResponse.model_validate(event)
        r.attendee_count = counts.get(event.id, 0)
        items.append(r)

    return PagedResponse.build(items=items, total=total, page=page, page_size=page_size)


async def get_event(db: AsyncSession, event_id: str, tenant_id: str) -> EventResponse:
    repo = EventRepository(db)
    rsvp_repo = EventRSVPRepository(db)

    event = await repo.get_by_id(event_id, tenant_id)
    if not event:
        raise NotFoundError("Event not found")

    counts = await rsvp_repo.get_attendee_counts(tenant_id, [event.id])
    event_response = EventResponse.model_validate(event)
    event_response.attendee_count = counts.get(event.id, 0)
    return event_response


async def create_event(db: AsyncSession, event_data: EventCreate, current_user: User) -> EventResponse:
    if event_data.end_time <= event_data.start_time:
        raise ValidationError("End time must be after start time")

    repo = EventRepository(db)
    user_repo = UserRepository(db)

    db_event = await repo.create(
        **event_data.model_dump(),
        created_by=current_user.id,
        tenant_id=current_user.tenant_id,
    )

    residents = await user_repo.get_residents_by_tenant(current_user.tenant_id)
    notification_repo = NotificationRepository(db)
    for resident in residents:
        await notification_repo.create(
            user_id=resident.id,
            title=f"Novo Evento: {db_event.title}",
            message=f"Participe! {db_event.title} em {db_event.event_date.strftime('%d/%m/%Y às %H:%M')}",
            tenant_id=current_user.tenant_id,
        )

    event_response = EventResponse.model_validate(db_event)
    event_response.attendee_count = 0
    return event_response


async def update_event(
    db: AsyncSession, event_id: str, tenant_id: str, update_data: dict
) -> EventResponse:
    repo = EventRepository(db)
    rsvp_repo = EventRSVPRepository(db)

    event = await repo.get_by_id(event_id, tenant_id)
    if not event:
        raise NotFoundError("Event not found")

    event = await repo.update_fields(event, update_data)

    attending_rsvps = await rsvp_repo.list_by_event(event_id, tenant_id, "attending")
    notification_repo = NotificationRepository(db)
    for rsvp in attending_rsvps:
        await notification_repo.create(
            user_id=rsvp.user_id,
            title=f"Evento Atualizado: {event.title}",
            message=f"O evento {event.title} foi atualizado. Confira os detalhes!",
            tenant_id=tenant_id,
        )

    counts = await rsvp_repo.get_attendee_counts(tenant_id, [event.id])
    event_response = EventResponse.model_validate(event)
    event_response.attendee_count = counts.get(event.id, 0)
    return event_response


async def cancel_event(db: AsyncSession, event_id: str, tenant_id: str) -> None:
    repo = EventRepository(db)
    rsvp_repo = EventRSVPRepository(db)

    event = await repo.get_by_id(event_id, tenant_id)
    if not event:
        raise NotFoundError("Event not found")

    event.status = "cancelled"
    await db.commit()

    attending_rsvps = await rsvp_repo.list_by_event(event_id, tenant_id, "attending")
    notification_repo = NotificationRepository(db)
    for rsvp in attending_rsvps:
        await notification_repo.create(
            user_id=rsvp.user_id,
            title=f"Evento Cancelado: {event.title}",
            message=f"O evento {event.title} foi cancelado.",
            tenant_id=tenant_id,
        )


async def create_or_update_rsvp(
    db: AsyncSession, event_id: str, current_user: User, rsvp_response: str
) -> EventRSVP:
    repo = EventRepository(db)
    rsvp_repo = EventRSVPRepository(db)

    event = await repo.get_by_id(event_id, current_user.tenant_id)
    if not event:
        raise NotFoundError("Event not found")

    if event.status == "cancelled":
        raise ValidationError("Cannot RSVP to a cancelled event")

    if rsvp_response == "attending" and event.capacity:
        count = await rsvp_repo.count_attending(event_id, current_user.tenant_id)
        if count >= event.capacity:
            raise ValidationError("Event is at full capacity")

    existing = await rsvp_repo.get_user_rsvp(event_id, current_user.id, current_user.tenant_id)
    if existing:
        existing.response = rsvp_response
        await db.commit()
        await db.refresh(existing)
        return existing

    rsvp = await rsvp_repo.create(
        event_id=event_id,
        user_id=current_user.id,
        response=rsvp_response,
        tenant_id=current_user.tenant_id,
    )
    return rsvp


async def get_my_rsvp(db: AsyncSession, event_id: str, current_user: User) -> EventRSVP:
    rsvp_repo = EventRSVPRepository(db)
    rsvp = await rsvp_repo.get_user_rsvp(event_id, current_user.id, current_user.tenant_id)
    if not rsvp:
        raise NotFoundError("RSVP not found")
    return rsvp


async def list_event_rsvps(db: AsyncSession, event_id: str, tenant_id: str) -> list[EventRSVP]:
    return await EventRSVPRepository(db).list_by_event(event_id, tenant_id)


async def mark_attendance(
    db: AsyncSession, rsvp_id: str, tenant_id: str, attended: bool
) -> EventRSVP:
    rsvp_repo = EventRSVPRepository(db)
    rsvp = await rsvp_repo.get_by_id(rsvp_id, tenant_id)
    if not rsvp:
        raise NotFoundError("RSVP not found")
    rsvp.attended = attended
    await db.commit()
    await db.refresh(rsvp)
    return rsvp
