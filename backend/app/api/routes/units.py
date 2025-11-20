from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import json

from app.core.database import get_db
from app.dependencies.auth import get_current_user
from app.models.base import Unit, User
from app.schemas.unit import UnitCreate, UnitUpdate, UnitResponse

router = APIRouter()

@router.get("/", response_model=List[UnitResponse])
async def list_units(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List all units for the current tenant"""
    result = await db.execute(
        select(Unit).where(Unit.tenant_id == current_user.tenant_id)
    )
    units = result.scalars().all()
    
    # Convert authorized_cpfs JSON to list
    for unit in units:
        if unit.authorized_cpfs:
            try:
                unit.authorized_cpfs = json.loads(unit.authorized_cpfs)
            except:
                unit.authorized_cpfs = []
        else:
            unit.authorized_cpfs = []
    
    return units

@router.post("/", response_model=UnitResponse, status_code=status.HTTP_201_CREATED)
async def create_unit(
    unit: UnitCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new unit (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can create units"
        )
    
    # Convert CPF list to JSON
    authorized_cpfs_json = None
    if unit.authorized_cpfs:
        authorized_cpfs_json = json.dumps(unit.authorized_cpfs)
    
    db_unit = Unit(
        block=unit.block,
        number=unit.number,
        authorized_cpfs=authorized_cpfs_json,
        tenant_id=current_user.tenant_id
    )
    db.add(db_unit)
    await db.commit()
    await db.refresh(db_unit)
    
    # Convert back to list for response
    if db_unit.authorized_cpfs:
        db_unit.authorized_cpfs = json.loads(db_unit.authorized_cpfs)
    else:
        db_unit.authorized_cpfs = []
    
    return db_unit

@router.get("/{unit_id}", response_model=UnitResponse)
async def get_unit(
    unit_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific unit"""
    result = await db.execute(
        select(Unit).where(
            Unit.id == unit_id,
            Unit.tenant_id == current_user.tenant_id
        )
    )
    unit = result.scalars().first()
    if not unit:
        raise HTTPException(status_code=404, detail="Unit not found")
    
    # Convert authorized_cpfs JSON to list
    if unit.authorized_cpfs:
        try:
            unit.authorized_cpfs = json.loads(unit.authorized_cpfs)
        except:
            unit.authorized_cpfs = []
    else:
        unit.authorized_cpfs = []
    
    return unit

@router.put("/{unit_id}", response_model=UnitResponse)
async def update_unit(
    unit_id: str,
    unit_update: UnitUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a unit (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can update units"
        )
    
    result = await db.execute(
        select(Unit).where(
            Unit.id == unit_id,
            Unit.tenant_id == current_user.tenant_id
        )
    )
    unit = result.scalars().first()
    if not unit:
        raise HTTPException(status_code=404, detail="Unit not found")
    
    # Update fields
    update_data = unit_update.model_dump(exclude_unset=True)
    
    # Handle authorized_cpfs conversion
    if 'authorized_cpfs' in update_data:
        if update_data['authorized_cpfs']:
            update_data['authorized_cpfs'] = json.dumps(update_data['authorized_cpfs'])
        else:
            update_data['authorized_cpfs'] = None
    
    for key, value in update_data.items():
        setattr(unit, key, value)
    
    await db.commit()
    await db.refresh(unit)
    
    # Convert back to list for response
    if unit.authorized_cpfs:
        unit.authorized_cpfs = json.loads(unit.authorized_cpfs)
    else:
        unit.authorized_cpfs = []
    
    return unit

@router.delete("/{unit_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_unit(
    unit_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a unit (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can delete units"
        )
    
    result = await db.execute(
        select(Unit).where(
            Unit.id == unit_id,
            Unit.tenant_id == current_user.tenant_id
        )
    )
    unit = result.scalars().first()
    if not unit:
        raise HTTPException(status_code=404, detail="Unit not found")
    
    await db.delete(unit)
    await db.commit()
    return None
