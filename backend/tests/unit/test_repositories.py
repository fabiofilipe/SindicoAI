"""
Unit tests for Repository Pattern layer.
Uses the SQLite test DB from conftest.py — exercises real SQL to validate queries.
"""
import pytest
from datetime import datetime, timedelta, timezone
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.base import User, UserRole, Tenant, CommonArea, Reservation, Unit
from app.repositories.user import UserRepository
from app.repositories.reservation import ReservationRepository
from app.core.security import get_password_hash


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def make_user(
    tenant_id: str,
    email: str = "user@test.com",
    role: str = UserRole.RESIDENT.value,
    user_id: str | None = None,
) -> User:
    return User(
        id=user_id or email,
        email=email,
        hashed_password=get_password_hash("Secret123!"),
        full_name="Test User",
        role=role,
        tenant_id=tenant_id,
    )


def make_area(tenant_id: str, area_id: str = "area-1") -> CommonArea:
    return CommonArea(
        id=area_id,
        name="Pool",
        capacity=20,
        tenant_id=tenant_id,
    )


def make_unit(tenant_id: str, unit_id: str = "unit-1") -> Unit:
    return Unit(id=unit_id, number="101", tenant_id=tenant_id)


def make_reservation(
    tenant_id: str,
    area_id: str,
    user_id: str,
    unit_id: str,
    start: datetime,
    end: datetime,
    status: str = "confirmed",
    res_id: str = "res-1",
) -> Reservation:
    return Reservation(
        id=res_id,
        common_area_id=area_id,
        user_id=user_id,
        unit_id=unit_id,
        tenant_id=tenant_id,
        start_time=start,
        end_time=end,
        status=status,
    )


# ---------------------------------------------------------------------------
# BaseRepository (tested via UserRepository)
# ---------------------------------------------------------------------------

class TestBaseRepository:
    @pytest.mark.asyncio
    async def test_save_and_get_by_id(self, db_session: AsyncSession, test_tenant):
        repo = UserRepository(db_session)
        user = make_user(test_tenant["id"], "save@test.com", user_id="save-1")

        saved = await repo.save(user)
        found = await repo.get_by_id("save-1", test_tenant["id"])

        assert found is not None
        assert found.email == "save@test.com"
        assert saved.id == found.id

    @pytest.mark.asyncio
    async def test_get_by_id_wrong_tenant_returns_none(self, db_session: AsyncSession, test_tenant):
        repo = UserRepository(db_session)
        user = make_user(test_tenant["id"], "tenant-iso@test.com", user_id="iso-1")
        await repo.save(user)

        result = await repo.get_by_id("iso-1", "other-tenant-id")

        assert result is None

    @pytest.mark.asyncio
    async def test_list_paginated_returns_items_and_total(self, db_session: AsyncSession, test_tenant):
        repo = UserRepository(db_session)
        for i in range(5):
            await repo.save(make_user(test_tenant["id"], f"page{i}@test.com", user_id=f"page-{i}"))

        items, total = await repo.list_paginated(test_tenant["id"], page=1, page_size=10)

        assert total == 5
        assert len(items) == 5

    @pytest.mark.asyncio
    async def test_list_paginated_respects_page_size(self, db_session: AsyncSession, test_tenant):
        repo = UserRepository(db_session)
        for i in range(5):
            await repo.save(make_user(test_tenant["id"], f"ps{i}@test.com", user_id=f"ps-{i}"))

        items, total = await repo.list_paginated(test_tenant["id"], page=1, page_size=3)

        assert total == 5
        assert len(items) == 3

    @pytest.mark.asyncio
    async def test_list_paginated_second_page(self, db_session: AsyncSession, test_tenant):
        repo = UserRepository(db_session)
        for i in range(5):
            await repo.save(make_user(test_tenant["id"], f"p2-{i}@test.com", user_id=f"p2-{i}"))

        items, total = await repo.list_paginated(test_tenant["id"], page=2, page_size=3)

        assert total == 5
        assert len(items) == 2  # 5 - 3 = 2 on second page

    @pytest.mark.asyncio
    async def test_update_fields(self, db_session: AsyncSession, test_tenant):
        repo = UserRepository(db_session)
        user = make_user(test_tenant["id"], "upd@test.com", user_id="upd-1")
        await repo.save(user)

        updated = await repo.update_fields(user, {"full_name": "Updated Name"})

        assert updated.full_name == "Updated Name"

    @pytest.mark.asyncio
    async def test_delete_removes_entity(self, db_session: AsyncSession, test_tenant):
        repo = UserRepository(db_session)
        user = make_user(test_tenant["id"], "del@test.com", user_id="del-1")
        await repo.save(user)

        await repo.delete(user)
        found = await repo.get_by_id("del-1", test_tenant["id"])

        assert found is None

    @pytest.mark.asyncio
    async def test_list_paginated_isolates_by_tenant(self, db_session: AsyncSession, test_tenant):
        repo = UserRepository(db_session)
        # Users in test tenant
        await repo.save(make_user(test_tenant["id"], "mine@test.com", user_id="mine-1"))

        # User in other tenant — create the other tenant first
        other_tenant = Tenant(id="other-tenant", name="Other Condo", domain="other.condo.com")
        db_session.add(other_tenant)
        await db_session.commit()
        await repo.save(make_user("other-tenant", "theirs@test.com", user_id="theirs-1"))

        items, total = await repo.list_paginated(test_tenant["id"], page=1, page_size=10)

        assert total == 1
        assert items[0].email == "mine@test.com"


# ---------------------------------------------------------------------------
# UserRepository specific methods
# ---------------------------------------------------------------------------

class TestUserRepository:
    @pytest.mark.asyncio
    async def test_get_by_email_returns_user(self, db_session: AsyncSession, test_tenant):
        repo = UserRepository(db_session)
        await repo.save(make_user(test_tenant["id"], "find@test.com", user_id="find-1"))

        found = await repo.get_by_email("find@test.com")

        assert found is not None
        assert found.email == "find@test.com"

    @pytest.mark.asyncio
    async def test_get_by_email_returns_none_when_missing(self, db_session: AsyncSession):
        repo = UserRepository(db_session)

        found = await repo.get_by_email("nobody@test.com")

        assert found is None

    @pytest.mark.asyncio
    async def test_get_by_id_any_tenant_ignores_tenant(self, db_session: AsyncSession, test_tenant):
        repo = UserRepository(db_session)
        await repo.save(make_user(test_tenant["id"], "any@test.com", user_id="any-1"))

        found = await repo.get_by_id_any_tenant("any-1")

        assert found is not None
        assert found.email == "any@test.com"

    @pytest.mark.asyncio
    async def test_get_admins_by_tenant(self, db_session: AsyncSession, test_tenant):
        repo = UserRepository(db_session)
        await repo.save(make_user(test_tenant["id"], "admin@test.com", role=UserRole.ADMIN.value, user_id="adm-1"))
        await repo.save(make_user(test_tenant["id"], "res@test.com", role=UserRole.RESIDENT.value, user_id="res-1"))

        admins = await repo.get_admins_by_tenant(test_tenant["id"])

        assert len(admins) == 1
        assert admins[0].role == UserRole.ADMIN.value

    @pytest.mark.asyncio
    async def test_get_residents_by_tenant(self, db_session: AsyncSession, test_tenant):
        repo = UserRepository(db_session)
        await repo.save(make_user(test_tenant["id"], "r1@test.com", role=UserRole.RESIDENT.value, user_id="r1"))
        await repo.save(make_user(test_tenant["id"], "r2@test.com", role=UserRole.RESIDENT.value, user_id="r2"))
        await repo.save(make_user(test_tenant["id"], "adm2@test.com", role=UserRole.ADMIN.value, user_id="adm2"))

        residents = await repo.get_residents_by_tenant(test_tenant["id"])

        assert len(residents) == 2

    @pytest.mark.asyncio
    async def test_email_exists_returns_true(self, db_session: AsyncSession, test_tenant):
        repo = UserRepository(db_session)
        await repo.save(make_user(test_tenant["id"], "exists@test.com", user_id="ex-1"))

        result = await repo.email_exists("exists@test.com", test_tenant["id"])

        assert result is True

    @pytest.mark.asyncio
    async def test_email_exists_returns_false(self, db_session: AsyncSession, test_tenant):
        repo = UserRepository(db_session)

        result = await repo.email_exists("ghost@test.com", test_tenant["id"])

        assert result is False

    @pytest.mark.asyncio
    async def test_email_exists_isolated_by_tenant(self, db_session: AsyncSession, test_tenant):
        repo = UserRepository(db_session)
        other_tenant = Tenant(id="other-t2", name="Other", domain="other2.com")
        db_session.add(other_tenant)
        await db_session.commit()
        await repo.save(make_user("other-t2", "cross@test.com", user_id="cross-1"))

        # Email exists in other-t2 but should NOT exist in test_tenant
        result = await repo.email_exists("cross@test.com", test_tenant["id"])

        assert result is False


# ---------------------------------------------------------------------------
# ReservationRepository
# ---------------------------------------------------------------------------

class TestReservationRepository:
    async def _setup(self, db_session: AsyncSession, test_tenant: dict):
        """Create area, user, and unit for reservation tests."""
        area = make_area(test_tenant["id"])
        unit = make_unit(test_tenant["id"])
        user = make_user(test_tenant["id"], "res-user@test.com", user_id="res-user")
        db_session.add(area)
        db_session.add(unit)
        db_session.add(user)
        await db_session.commit()
        return area, unit, user

    @pytest.mark.asyncio
    async def test_has_conflict_true_when_overlapping(self, db_session: AsyncSession, test_tenant):
        area, unit, user = await self._setup(db_session, test_tenant)
        repo = ReservationRepository(db_session)

        start = datetime(2025, 6, 1, 10, 0, tzinfo=timezone.utc)
        end = datetime(2025, 6, 1, 12, 0, tzinfo=timezone.utc)
        res = make_reservation(test_tenant["id"], area.id, user.id, unit.id, start, end)
        db_session.add(res)
        await db_session.commit()

        # Overlapping: starts at 11, ends at 13 — overlaps with 10-12
        conflict = await repo.has_conflict(area.id, datetime(2025, 6, 1, 11, 0, tzinfo=timezone.utc),
                                           datetime(2025, 6, 1, 13, 0, tzinfo=timezone.utc),
                                           test_tenant["id"])

        assert conflict is True

    @pytest.mark.asyncio
    async def test_has_conflict_false_when_adjacent(self, db_session: AsyncSession, test_tenant):
        area, unit, user = await self._setup(db_session, test_tenant)
        repo = ReservationRepository(db_session)

        start = datetime(2025, 6, 1, 10, 0, tzinfo=timezone.utc)
        end = datetime(2025, 6, 1, 12, 0, tzinfo=timezone.utc)
        res = make_reservation(test_tenant["id"], area.id, user.id, unit.id, start, end)
        db_session.add(res)
        await db_session.commit()

        # Starts exactly when the first one ends — no conflict
        conflict = await repo.has_conflict(area.id, datetime(2025, 6, 1, 12, 0, tzinfo=timezone.utc),
                                           datetime(2025, 6, 1, 14, 0, tzinfo=timezone.utc),
                                           test_tenant["id"])

        assert conflict is False

    @pytest.mark.asyncio
    async def test_has_conflict_false_for_cancelled(self, db_session: AsyncSession, test_tenant):
        area, unit, user = await self._setup(db_session, test_tenant)
        repo = ReservationRepository(db_session)

        start = datetime(2025, 6, 1, 10, 0, tzinfo=timezone.utc)
        end = datetime(2025, 6, 1, 12, 0, tzinfo=timezone.utc)
        res = make_reservation(test_tenant["id"], area.id, user.id, unit.id, start, end, status="cancelled")
        db_session.add(res)
        await db_session.commit()

        conflict = await repo.has_conflict(area.id, start, end, test_tenant["id"])

        assert conflict is False

    @pytest.mark.asyncio
    async def test_has_conflict_respects_exclude_id(self, db_session: AsyncSession, test_tenant):
        area, unit, user = await self._setup(db_session, test_tenant)
        repo = ReservationRepository(db_session)

        start = datetime(2025, 6, 1, 10, 0, tzinfo=timezone.utc)
        end = datetime(2025, 6, 1, 12, 0, tzinfo=timezone.utc)
        res = make_reservation(test_tenant["id"], area.id, user.id, unit.id, start, end, res_id="excl-1")
        db_session.add(res)
        await db_session.commit()

        # Same time window but exclude_id = own ID → no conflict (self-edit scenario)
        conflict = await repo.has_conflict(area.id, start, end, test_tenant["id"], exclude_id="excl-1")

        assert conflict is False

    @pytest.mark.asyncio
    async def test_unit_limit_not_exceeded(self, db_session: AsyncSession, test_tenant):
        area, unit, user = await self._setup(db_session, test_tenant)
        repo = ReservationRepository(db_session)

        start = datetime(2025, 6, 1, 10, 0, tzinfo=timezone.utc)
        end = datetime(2025, 6, 1, 12, 0, tzinfo=timezone.utc)

        exceeded = await repo.unit_limit_exceeded(unit.id, start, end, test_tenant["id"], max_reservations=1)

        assert exceeded is False

    @pytest.mark.asyncio
    async def test_unit_limit_exceeded(self, db_session: AsyncSession, test_tenant):
        area, unit, user = await self._setup(db_session, test_tenant)
        repo = ReservationRepository(db_session)

        start = datetime(2025, 6, 1, 10, 0, tzinfo=timezone.utc)
        end = datetime(2025, 6, 1, 12, 0, tzinfo=timezone.utc)
        res = make_reservation(test_tenant["id"], area.id, user.id, unit.id, start, end)
        db_session.add(res)
        await db_session.commit()

        exceeded = await repo.unit_limit_exceeded(unit.id, start, end, test_tenant["id"], max_reservations=1)

        assert exceeded is True
