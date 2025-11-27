from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class UnitBase(BaseModel):
    number: str = Field(..., max_length=20, description="Unit number")
    block: Optional[str] = Field(None, max_length=10, description="Tower/Block")
    floor: Optional[int] = Field(None, description="Floor number")
    type: Optional[str] = Field(None, max_length=50, description="Unit type (e.g., 2-bedrooms)")

class UnitCreate(UnitBase):
    """Schema for creating a new unit"""
    pass

class UnitUpdate(BaseModel):
    """Schema for updating an existing unit"""
    number: Optional[str] = Field(None, max_length=20)
    block: Optional[str] = Field(None, max_length=10)
    floor: Optional[int] = None
    type: Optional[str] = Field(None, max_length=50)

class UnitResponse(UnitBase):
    """Schema for unit API responses"""
    id: str
    tenant_id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class UserSimple(BaseModel):
    """Simplified user info for unit details"""
    id: str
    full_name: str
    email: str
    role: str
    
    class Config:
        from_attributes = True

class UnitWithResidents(UnitResponse):
    """Schema for unit with associated residents"""
    residents: List[UserSimple] = []

class AssignUserRequest(BaseModel):
    """Schema for assigning a user to a unit"""
    user_id: str = Field(..., description="ID of the user to assign to this unit")

class CSVImportResponse(BaseModel):
    """Schema for CSV import results"""
    total_rows: int
    created: int
    skipped: int
    errors: List[str] = []
