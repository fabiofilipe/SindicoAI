from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CommonAreaBase(BaseModel):
    name: str
    description: Optional[str] = None
    capacity: Optional[int] = None
    opening_time: Optional[str] = None
    closing_time: Optional[str] = None
    is_active: bool = True

class CommonAreaCreate(CommonAreaBase):
    pass

class CommonAreaUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    capacity: Optional[int] = None
    opening_time: Optional[str] = None
    closing_time: Optional[str] = None
    is_active: Optional[bool] = None

class CommonAreaResponse(CommonAreaBase):
    id: str
    tenant_id: str

    class Config:
        from_attributes = True
