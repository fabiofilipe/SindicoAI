from math import ceil
from typing import Generic, TypeVar, Type, Any
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

T = TypeVar("T")


class BaseRepository(Generic[T]):
    model: Type[T]

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, entity_id: str, tenant_id: str) -> T | None:
        result = await self.db.execute(
            select(self.model).where(
                self.model.id == entity_id,
                self.model.tenant_id == tenant_id,
            )
        )
        return result.scalars().first()

    async def list_paginated(
        self,
        tenant_id: str,
        page: int,
        page_size: int,
        base_query=None,
    ) -> tuple[list[T], int]:
        """Returns (items, total). Accepts optional pre-built base_query."""
        if base_query is None:
            base_query = select(self.model).where(self.model.tenant_id == tenant_id)

        total = await self.db.scalar(
            select(func.count()).select_from(base_query.subquery())
        )
        result = await self.db.execute(
            base_query.offset((page - 1) * page_size).limit(page_size)
        )
        return result.scalars().all(), total or 0

    async def save(self, entity: T) -> T:
        self.db.add(entity)
        await self.db.commit()
        await self.db.refresh(entity)
        return entity

    async def update_fields(self, entity: T, data: dict[str, Any]) -> T:
        for key, value in data.items():
            setattr(entity, key, value)
        await self.db.commit()
        await self.db.refresh(entity)
        return entity

    async def delete(self, entity: T) -> None:
        await self.db.delete(entity)
        await self.db.commit()
