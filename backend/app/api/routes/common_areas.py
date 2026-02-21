from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.database import get_db
from app.dependencies.auth import get_current_user
from app.models.base import CommonArea, User, UserRole
from app.schemas.common_area import CommonAreaCreate, CommonAreaUpdate, CommonAreaResponse
from app.schemas.pagination import PagedResponse

router = APIRouter()


@router.get("/", response_model=PagedResponse[CommonAreaResponse])
async def list_common_areas(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List all common areas for the current tenant"""
    base_query = select(CommonArea).where(CommonArea.tenant_id == current_user.tenant_id)
    total = await db.scalar(select(func.count()).select_from(base_query.subquery()))
    result = await db.execute(base_query.offset((page - 1) * page_size).limit(page_size))
    areas = result.scalars().all()
    return PagedResponse.build(items=areas, total=total, page=page, page_size=page_size)

@router.post("/", response_model=CommonAreaResponse, status_code=status.HTTP_201_CREATED)
async def create_common_area(
    area: CommonAreaCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new common area (admin only)"""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can create common areas"
        )
    
    db_area = CommonArea(**area.model_dump(), tenant_id=current_user.tenant_id)
    db.add(db_area)
    await db.commit()
    await db.refresh(db_area)
    return db_area

@router.get("/{area_id}", response_model=CommonAreaResponse)
async def get_common_area(
    area_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific common area"""
    result = await db.execute(
        select(CommonArea).where(
            CommonArea.id == area_id,
            CommonArea.tenant_id == current_user.tenant_id
        )
    )
    area = result.scalars().first()
    if not area:
        raise HTTPException(status_code=404, detail="Common area not found")
    return area

@router.put("/{area_id}", response_model=CommonAreaResponse)
async def update_common_area(
    area_id: str,
    area_update: CommonAreaUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a common area (admin only)"""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can update common areas"
        )
    
    result = await db.execute(
        select(CommonArea).where(
            CommonArea.id == area_id,
            CommonArea.tenant_id == current_user.tenant_id
        )
    )
    area = result.scalars().first()
    if not area:
        raise HTTPException(status_code=404, detail="Common area not found")
    
    for key, value in area_update.model_dump(exclude_unset=True).items():
        setattr(area, key, value)
    
    await db.commit()
    await db.refresh(area)
    return area

@router.delete("/{area_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_common_area(
    area_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a common area (admin only)"""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can delete common areas"
        )
    
    result = await db.execute(
        select(CommonArea).where(
            CommonArea.id == area_id,
            CommonArea.tenant_id == current_user.tenant_id
        )
    )
    area = result.scalars().first()
    if not area:
        raise HTTPException(status_code=404, detail="Common area not found")
    
    await db.delete(area)
    await db.commit()
    return None
