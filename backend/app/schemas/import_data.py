from pydantic import BaseModel, EmailStr
from typing import Optional, List

class UnitImportRow(BaseModel):
    block: Optional[str] = None
    number: str
    authorized_cpfs: Optional[str] = None  # Comma-separated CPFs

class ResidentImportRow(BaseModel):
    cpf: str
    full_name: str
    unit_number: str
    email: Optional[EmailStr] = None  # Optional - user can register later
    role: str = "resident"
    password: Optional[str] = None  # Optional - user sets on registration

class ImportResponse(BaseModel):
    success_count: int
    error_count: int
    errors: List[str] = []
