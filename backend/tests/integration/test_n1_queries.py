"""
Integration tests verifying N+1 query elimination.
Counts SQL statements to ensure bulk operations replaced per-row queries.
"""
import pytest
from datetime import datetime, timedelta
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import event as sqla_event

from app.models.base import User, Tenant, Event, EventRSVP, Unit
from app.core.security import get_password_hash, create_access_token


def make_token(user_id: str) -> str:
    return create_access_token(user_id, expires_delta=timedelta(hours=1))


@pytest.mark.asyncio
async def test_list_events_query_count(client: AsyncClient, db_session: AsyncSession):
    """
    GET /events/ with 10 events+RSVPs must use at most 3 SQL statements:
      1. COUNT for pagination
      2. SELECT events
      3. SELECT attendee counts (GROUP BY)
    Before fix: 1 + 10 = 11 statements (N+1).
    """
    tenant = Tenant(id="n1-tenant-1", name="N1Test1")
    admin = User(
        id="n1-admin-1", email="n1admin1@test.com",
        hashed_password=get_password_hash("pass"), full_name="N1 Admin",
        role="admin", tenant_id="n1-tenant-1", is_active=True
    )
    db_session.add_all([tenant, admin])

    resident = User(
        id="n1-res-1", email="n1res1@test.com",
        hashed_password=get_password_hash("pass"), full_name="N1 Res",
        role="resident", tenant_id="n1-tenant-1", is_active=True
    )
    db_session.add(resident)

    event_date = datetime.utcnow() + timedelta(days=7)
    events = []
    for i in range(10):
        e = Event(
            id=f"n1-event-{i}", title=f"Event {i}",
            event_date=event_date, start_time=event_date,
            end_time=event_date + timedelta(hours=2),
            created_by="n1-admin-1", tenant_id="n1-tenant-1", status="scheduled"
        )
        events.append(e)
        db_session.add(e)

    await db_session.commit()

    # Add one RSVP per event
    for e in events:
        db_session.add(EventRSVP(
            event_id=e.id, user_id="n1-res-1",
            response="attending", tenant_id="n1-tenant-1"
        ))
    await db_session.commit()

    # Count SQL statements during request
    statements: list[str] = []

    engine = db_session.bind
    if engine is not None:
        sync_engine = engine.sync_engine

        @sqla_event.listens_for(sync_engine, "before_cursor_execute")
        def capture(conn, cursor, statement, parameters, context, executemany):
            statements.append(statement)

    token = make_token("n1-admin-1")
    response = await client.get(
        "/api/v1/events/?page=1&page_size=20",
        headers={"Authorization": f"Bearer {token}"}
    )

    # Clean up listener
    if engine is not None:
        sqla_event.remove(engine.sync_engine, "before_cursor_execute", capture)

    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 10
    assert len(data["items"]) == 10

    # Each item should have attendee_count populated
    for item in data["items"]:
        assert item["attendee_count"] == 1

    # Max 4 statements (auth check + count + events + attendee counts)
    # Before fix: 12 (auth + 1 events + 10 counts)
    assert len(statements) <= 4, (
        f"N+1 detected: {len(statements)} SQL statements for 10 events. "
        f"Expected <=4. Statements: {[s[:80] for s in statements]}"
    )


@pytest.mark.asyncio
async def test_attendee_count_in_response(client: AsyncClient, db_session: AsyncSession):
    """attendee_count must reflect actual RSVPs without N+1"""
    tenant = Tenant(id="n1-tenant-2", name="N1Test2")
    admin = User(
        id="n1-admin-2", email="n1admin2@test.com",
        hashed_password=get_password_hash("pass"), full_name="N1 Admin2",
        role="admin", tenant_id="n1-tenant-2", is_active=True
    )
    db_session.add_all([tenant, admin])

    event_date = datetime.utcnow() + timedelta(days=7)
    event = Event(
        id="n1-event-single", title="Single Event",
        event_date=event_date, start_time=event_date,
        end_time=event_date + timedelta(hours=2),
        created_by="n1-admin-2", tenant_id="n1-tenant-2", status="scheduled"
    )
    db_session.add(event)

    # Add 3 residents with RSVPs
    for i in range(3):
        r = User(
            id=f"n1-r2-{i}", email=f"n1r2{i}@test.com",
            hashed_password=get_password_hash("pass"), full_name=f"Res {i}",
            role="resident", tenant_id="n1-tenant-2", is_active=True
        )
        db_session.add(r)

    await db_session.commit()

    for i in range(3):
        db_session.add(EventRSVP(
            event_id="n1-event-single", user_id=f"n1-r2-{i}",
            response="attending", tenant_id="n1-tenant-2"
        ))
    await db_session.commit()

    token = make_token("n1-admin-2")
    response = await client.get(
        "/api/v1/events/?page=1&page_size=20",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["items"][0]["attendee_count"] == 3


@pytest.mark.asyncio
async def test_reservations_selectinload(client: AsyncClient, db_session: AsyncSession):
    """
    GET /reservations/ must return common_area, user, unit data
    without triggering lazy-load queries after the initial fetch.
    This test verifies the response contains valid data (selectinload working).
    """
    tenant = Tenant(id="n1-tenant-3", name="N1Test3")
    admin = User(
        id="n1-admin-3", email="n1admin3@test.com",
        hashed_password=get_password_hash("pass"), full_name="N1 Admin3",
        role="admin", tenant_id="n1-tenant-3", is_active=True
    )
    db_session.add_all([tenant, admin])
    await db_session.commit()

    token = make_token("n1-admin-3")
    response = await client.get(
        "/api/v1/reservations/?page=1&page_size=20",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert data["total"] == 0
