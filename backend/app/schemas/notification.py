from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class NotificationBase(BaseModel):
    title: str
    message: str

class NotificationCreate(NotificationBase):
    user_id: str

class NotificationResponse(NotificationBase):
    id: str
    is_read: bool
    created_at: datetime
    user_id: str
    tenant_id: str

    class Config:
        from_attributes = True
