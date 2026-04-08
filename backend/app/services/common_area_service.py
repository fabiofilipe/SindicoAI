from sqlalchemy.ext.asyncio import AsyncSession

from app.exceptions import NotFoundError
from app.models.base import CommonArea
from app.repositories.common_area import CommonAreaRepository
from app.schemas.pagination import PagedResponse
import logging

logger = logging.getLogger(__name__)


async def list_common_areas(
    db: AsyncSession, tenant_id: str, page: int, page_size: int
) -> PagedResponse:
    repo = CommonAreaRepository(db)
    items, total = await repo.list_paginated(tenant_id, page, page_size)
    return PagedResponse.build(items=items, total=total, page=page, page_size=page_size)


async def get_common_area(db: AsyncSession, area_id: str, tenant_id: str) -> CommonArea:
    area = await CommonAreaRepository(db).get_by_id(area_id, tenant_id)
    if not area:
        raise NotFoundError("Área comum não encontrada")
    return area


async def create_common_area(db: AsyncSession, data: dict, tenant_id: str) -> CommonArea:
    return await CommonAreaRepository(db).create(**data, tenant_id=tenant_id)


async def update_common_area(
    db: AsyncSession, area_id: str, tenant_id: str, data: dict
) -> CommonArea:
    repo = CommonAreaRepository(db)
    area = await repo.get_by_id(area_id, tenant_id)
    if not area:
        raise NotFoundError("Área comum não encontrada")
    return await repo.update_fields(area, data)


async def delete_common_area(db: AsyncSession, area_id: str, tenant_id: str) -> None:
    repo = CommonAreaRepository(db)
    area = await repo.get_by_id(area_id, tenant_id)
    if not area:
        raise NotFoundError("Área comum não encontrada")
    await repo.delete(area)
