from typing import List
import csv
import io
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import json

from app.core.database import get_db
from app.dependencies.auth import get_current_user
from app.models.base import Unit, User
from app.schemas.unit import UnitCreate, UnitUpdate, UnitResponse, UnitWithResidents, AssignUserRequest, CSVImportResponse

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
    
    db_unit = Unit(
        number=unit.number,
        block=unit.block,
        floor=unit.floor,
        type=unit.type,
        tenant_id=current_user.tenant_id
    )
    db.add(db_unit)
    await db.commit()
    await db.refresh(db_unit)
    
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
    
    for key, value in update_data.items():
        setattr(unit, key, value)
    
    await db.commit()
    await db.refresh(unit)
    
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

@router.get("/{unit_id}/with-residents", response_model=UnitWithResidents)
async def get_unit_with_residents(
    unit_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get unit with associated residents"""
    result = await db.execute(
        select(Unit).where(
            Unit.id == unit_id,
            Unit.tenant_id == current_user.tenant_id
        )
    )
    unit = result.scalars().first()
    if not unit:
        raise HTTPException(status_code=404, detail="Unit not found")
    
    # Get residents
    residents_result = await db.execute(
        select(User).where(User.unit_id == unit_id)
    )
    residents = residents_result.scalars().all()
    
    # Build response
    unit_dict = {
        "id": unit.id,
        "number": unit.number,
        "block": unit.block,
        "floor": unit.floor,
        "type": unit.type,
        "tenant_id": unit.tenant_id,
        "created_at": unit.created_at,
        "updated_at": unit.updated_at,
        "residents": [
            {
                "id": r.id,
                "full_name": r.full_name,
                "email": r.email,
                "role": r.role
            } for r in residents
        ]
    }
    
    return unit_dict

@router.put("/{unit_id}/assign-user")
async def assign_user_to_unit(
    unit_id: str,
    request: AssignUserRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Assign a user to this unit (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can assign users to units"
        )
    
    # Verify unit exists
    unit_result = await db.execute(
        select(Unit).where(
            Unit.id == unit_id,
            Unit.tenant_id == current_user.tenant_id
        )
    )
    unit = unit_result.scalars().first()
    if not unit:
        raise HTTPException(status_code=404, detail="Unit not found")
    
    # Verify user exists and belongs to same tenant
    user_result = await db.execute(
        select(User).where(
            User.id == request.user_id,
            User.tenant_id == current_user.tenant_id
        )
    )
    user = user_result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Assign unit to user
    user.unit_id = unit_id
    await db.commit()
    
    return {"message": f"User {user.full_name} assigned to unit {unit.number}"}

@router.delete("/{unit_id}/remove-user/{user_id}")
async def remove_user_from_unit(
    unit_id: str,
    user_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Remove user from unit (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can remove users from units"
        )
    
    user_result = await db.execute(
        select(User).where(
            User.id == user_id,
            User.unit_id == unit_id
        )
    )
    user = user_result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found in this unit")
    
    user.unit_id = None
    await db.commit()
    
    return {"message": f"User {user.full_name} removed from unit"}

@router.post("/import-csv", response_model=CSVImportResponse)
async def import_units_csv(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Import units from CSV file (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can import units"
        )
    
    # Read CSV content
    content = await file.read()
    decoded_content = content.decode('utf-8')
    reader = csv.DictReader(io.StringIO(decoded_content))
    
    total_rows = 0
    created = 0
    skipped = 0
    errors = []
    
    # Expected columns: number, block, floor, type
    for row in reader:
        total_rows += 1
        try:
            # Check if unit already exists
            existing = await db.execute(
                select(Unit).where(
                    Unit.tenant_id == current_user.tenant_id,
                    Unit.number == row.get('number'),
                    Unit.block == row.get('block', '')
                )
            )
            if existing.scalars().first():
                skipped += 1
                continue
            
            # Create new unit
            new_unit = Unit(
                number=row.get('number'),
                block=row.get('block'),
                floor=int(row.get('floor')) if row.get('floor') else None,
                type=row.get('type'),
                tenant_id=current_user.tenant_id
            )
            db.add(new_unit)
            created += 1
            
        except Exception as e:
            errors.append(f"Row {total_rows}: {str(e)}")
    
    await db.commit()
    
    return {
        "total_rows": total_rows,
        "created": created,
        "skipped": skipped,
        "errors": errors
    }
