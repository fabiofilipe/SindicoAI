from pydantic import BaseModel
from typing import Optional, List

class UnitBase(BaseModel):
    block: Optional[str] = None
    number: str

class UnitCreate(UnitBase):
    authorized_cpfs: Optional[List[str]] = None  # List of CPFs

class UnitUpdate(BaseModel):
    block: Optional[str] = None
    number: Optional[str] = None
    authorized_cpfs: Optional[List[str]] = None

class UnitResponse(UnitBase):
    id: str
    tenant_id: str
    authorized_cpfs: Optional[List[str]] = None

    class Config:
        from_attributes = True
