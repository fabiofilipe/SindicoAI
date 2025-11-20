from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class NotificationBase(BaseModel):
    title: str
    message: str

class NotificationCreate(NotificationBase):
    user_ids: Optional[List[str]] = None  # Specific users
    unit_ids: Optional[List[str]] = None  # All residents of these units
    send_to_all: bool = False  # Send to all residents in tenant

class NotificationResponse(NotificationBase):
    id: str
    is_read: bool
    created_at: datetime
    user_id: str
    tenant_id: str

    class Config:
        from_attributes = True
