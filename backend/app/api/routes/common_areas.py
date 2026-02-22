from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.dependencies.auth import get_current_user, require_admin
from app.models.base import User
from app.schemas.common_area import CommonAreaCreate, CommonAreaUpdate, CommonAreaResponse
from app.schemas.pagination import PagedResponse
from app.services.common_area_service import (
    list_common_areas, get_common_area,
    create_common_area, update_common_area, delete_common_area,
)

router = APIRouter()


@router.get("/", response_model=PagedResponse[CommonAreaResponse])
async def list_common_areas_endpoint(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await list_common_areas(db, current_user.tenant_id, page, page_size)


@router.post("/", response_model=CommonAreaResponse, status_code=status.HTTP_201_CREATED)
async def create_common_area_endpoint(
    area: CommonAreaCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    return await create_common_area(db, area.model_dump(), current_user.tenant_id)


@router.get("/{area_id}", response_model=CommonAreaResponse)
async def get_common_area_endpoint(
    area_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await get_common_area(db, area_id, current_user.tenant_id)


@router.put("/{area_id}", response_model=CommonAreaResponse)
async def update_common_area_endpoint(
    area_id: str,
    area_update: CommonAreaUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    return await update_common_area(db, area_id, current_user.tenant_id, area_update.model_dump(exclude_unset=True))


@router.delete("/{area_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_common_area_endpoint(
    area_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    await delete_common_area(db, area_id, current_user.tenant_id)
