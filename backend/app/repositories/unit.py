from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.base import Unit, User
from .base import BaseRepository


class UnitRepository(BaseRepository[Unit]):
    model = Unit

    def __init__(self, db: AsyncSession):
        super().__init__(db)

    async def get_with_residents(self, unit_id: str, tenant_id: str) -> tuple[Unit | None, list[User]]:
        unit = await self.get_by_id(unit_id, tenant_id)
        if not unit:
            return None, []
        result = await self.db.execute(
            select(User).where(User.unit_id == unit_id)
        )
        return unit, result.scalars().all()

    async def get_existing_keys(self, tenant_id: str) -> set[tuple[str, str]]:
        """Returns set of (number, block or '') for fast duplicate checks."""
        result = await self.db.execute(
            select(Unit.number, Unit.block).where(Unit.tenant_id == tenant_id)
        )
        return {(r[0], r[1] or "") for r in result.all()}

    async def get_by_number(self, number: str, tenant_id: str) -> Unit | None:
        result = await self.db.execute(
            select(Unit).where(Unit.number == number, Unit.tenant_id == tenant_id)
        )
        return result.scalars().first()

    async def get_all_by_tenant(self, tenant_id: str) -> list[Unit]:
        result = await self.db.execute(
            select(Unit).where(Unit.tenant_id == tenant_id)
        )
        return result.scalars().all()
