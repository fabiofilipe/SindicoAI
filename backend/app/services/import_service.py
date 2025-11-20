import pandas as pd
from typing import List, Tuple
from io import BytesIO
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import ValidationError

from app.models.base import Unit, User
from app.schemas.import_data import UnitImportRow, ResidentImportRow
from app.core.security import get_password_hash

async def parse_file(file_content: bytes, file_extension: str) -> pd.DataFrame:
    """
    Parse CSV or Excel file and return DataFrame
    """
    try:
        if file_extension in ['.csv', '.txt']:
            df = pd.read_csv(BytesIO(file_content))
        elif file_extension in ['.xlsx', '.xls']:
            df = pd.read_excel(BytesIO(file_content))
        else:
            raise ValueError(f"Unsupported file format: {file_extension}")
        
        return df
    except Exception as e:
        raise ValueError(f"Error parsing file: {str(e)}")

def validate_units(df: pd.DataFrame) -> Tuple[List[UnitImportRow], List[str]]:
    """
    Validate unit data from DataFrame
    Returns: (valid_units, errors)
    """
    valid_units = []
    errors = []
    
    for idx, row in df.iterrows():
        try:
            unit = UnitImportRow(**row.to_dict())
            valid_units.append(unit)
        except ValidationError as e:
            errors.append(f"Row {idx + 2}: {str(e)}")
    
    return valid_units, errors

def validate_residents(df: pd.DataFrame) -> Tuple[List[ResidentImportRow], List[str]]:
    """
    Validate resident data from DataFrame
    Returns: (valid_residents, errors)
    """
    valid_residents = []
    errors = []
    
    for idx, row in df.iterrows():
        try:
            resident = ResidentImportRow(**row.to_dict())
            valid_residents.append(resident)
        except ValidationError as e:
            errors.append(f"Row {idx + 2}: {str(e)}")
    
    return valid_residents, errors

async def import_units(
    db: AsyncSession,
    units: List[UnitImportRow],
    tenant_id: str
) -> int:
    """
    Bulk insert units into database
    Returns: number of units created
    """
    import json
    created_count = 0
    
    for unit_data in units:
        # Convert comma-separated CPFs to JSON array
        authorized_cpfs_json = None
        if unit_data.authorized_cpfs:
            cpf_list = [cpf.strip() for cpf in unit_data.authorized_cpfs.split(',')]
            authorized_cpfs_json = json.dumps(cpf_list)
        
        db_unit = Unit(
            block=unit_data.block,
            number=unit_data.number,
            authorized_cpfs=authorized_cpfs_json,
            tenant_id=tenant_id
        )
        db.add(db_unit)
        created_count += 1
    
    await db.commit()
    return created_count

async def import_residents(
    db: AsyncSession,
    residents: List[ResidentImportRow],
    tenant_id: str
) -> Tuple[int, List[str]]:
    """
    Bulk insert/update residents into database.
    If email/password provided: creates full user account.
    If only CPF: adds CPF to unit's authorized list for future self-registration.
    Returns: (number of residents processed, errors)
    """
    from sqlalchemy.future import select
    import json
    
    created_count = 0
    errors = []
    
    for resident_data in residents:
        # Find unit by number
        result = await db.execute(
            select(Unit).where(
                Unit.number == resident_data.unit_number,
                Unit.tenant_id == tenant_id
            )
        )
        unit = result.scalars().first()
        
        if not unit:
            errors.append(f"Unit {resident_data.unit_number} not found for CPF {resident_data.cpf}")
            continue
        
        # If email and password provided, create full user account
        if resident_data.email and resident_data.password:
            # Check if email already exists
            result = await db.execute(
                select(User).where(User.email == resident_data.email)
            )
            existing_user = result.scalars().first()
            
            if existing_user:
                errors.append(f"Email {resident_data.email} already exists")
                continue
            
            # Check if CPF already exists
            result = await db.execute(
                select(User).where(User.cpf == resident_data.cpf)
            )
            existing_cpf = result.scalars().first()
            
            if existing_cpf:
                errors.append(f"CPF {resident_data.cpf} already registered")
                continue
            
            db_user = User(
                email=resident_data.email,
                cpf=resident_data.cpf,
                full_name=resident_data.full_name,
                hashed_password=get_password_hash(resident_data.password),
                role=resident_data.role,
                tenant_id=tenant_id,
                unit_id=unit.id
            )
            db.add(db_user)
        
        # Always add CPF to authorized list if not already there
        if unit.authorized_cpfs:
            try:
                cpf_list = json.loads(unit.authorized_cpfs)
            except:
                cpf_list = []
        else:
            cpf_list = []
        
        if resident_data.cpf not in cpf_list:
            cpf_list.append(resident_data.cpf)
            unit.authorized_cpfs = json.dumps(cpf_list)
        
        created_count += 1
    
    await db.commit()
    return created_count, errors
