from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ReservationSettings(BaseModel):
    """Settings for reservation rules"""
    min_hours_advance: int = 1  # Minimum hours in advance to make a reservation
    max_days_advance: int = 30  # Maximum days in advance to make a reservation
    max_hours_duration: int = 4  # Maximum duration of a reservation in hours
    cancellation_hours_advance: int = 24  # Hours in advance required to cancel

class NotificationSettings(BaseModel):
    """Settings for notification preferences"""
    email_enabled: bool = True
    sms_enabled: bool = False
    push_enabled: bool = True
    notification_email: str = ""
    quiet_hours_start: str = "22:00"  # Format: "HH:MM"
    quiet_hours_end: str = "08:00"  # Format: "HH:MM"

class CondominiumData(BaseModel):
    """Basic condominium information"""
    name: str
    address: Optional[str] = None
    phone: Optional[str] = None
    cnpj: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zipcode: Optional[str] = None

class SettingsUpdate(BaseModel):
    """Schema for updating settings"""
    # Condominium data
    name: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    cnpj: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zipcode: Optional[str] = None

    # Reservation settings
    reservation_settings: Optional[ReservationSettings] = None

    # Notification settings
    notification_settings: Optional[NotificationSettings] = None

class SettingsResponse(BaseModel):
    """Schema for settings response"""
    id: str
    name: str
    domain: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    cnpj: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zipcode: Optional[str] = None

    reservation_settings: dict
    notification_settings: dict

    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
