from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class EventBase(BaseModel):
    title: str
    description: Optional[str] = None
    event_date: datetime
    start_time: datetime
    end_time: datetime
    location: Optional[str] = None
    common_area_id: Optional[str] = None
    capacity: Optional[int] = None

class EventCreate(EventBase):
    pass

class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    event_date: Optional[datetime] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    location: Optional[str] = None
    common_area_id: Optional[str] = None
    capacity: Optional[int] = None
    status: Optional[str] = None

class EventResponse(EventBase):
    id: str
    status: str
    created_at: datetime
    updated_at: datetime
    created_by: str
    tenant_id: str
    attendee_count: Optional[int] = None

    class Config:
        from_attributes = True

class EventRSVPBase(BaseModel):
    response: str  # attending, declined, maybe

class EventRSVPCreate(EventRSVPBase):
    pass

class EventRSVPResponse(EventRSVPBase):
    id: str
    event_id: str
    user_id: str
    attended: bool
    created_at: datetime

    class Config:
        from_attributes = True
