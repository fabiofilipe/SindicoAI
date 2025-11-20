from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ReservationBase(BaseModel):
    start_time: datetime
    end_time: datetime
    common_area_id: str

class ReservationCreate(ReservationBase):
    pass

class ReservationUpdate(BaseModel):
    status: Optional[str] = None

class ReservationResponse(ReservationBase):
    id: str
    status: str
    created_at: datetime
    user_id: str
    unit_id: str
    tenant_id: str

    class Config:
        from_attributes = True
