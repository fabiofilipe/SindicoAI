from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date

# ============================================
# Common Areas Usage Report
# ============================================

class CommonAreaUsageStats(BaseModel):
    """Statistics for a single common area"""
    common_area_id: str
    common_area_name: str
    total_reservations: int
    total_hours_reserved: float
    most_popular_day: Optional[str] = None
    average_duration_hours: Optional[float] = None

    class Config:
        from_attributes = True

class CommonAreasUsageReport(BaseModel):
    """Report of common areas usage"""
    start_date: date
    end_date: date
    total_reservations: int
    total_areas_used: int
    areas_stats: List[CommonAreaUsageStats]

# ============================================
# Reservations Report
# ============================================

class ReservationReportItem(BaseModel):
    """Single reservation item in report"""
    id: str
    common_area_name: str
    user_name: str
    user_email: str
    unit_number: Optional[str] = None
    start_time: datetime
    end_time: datetime
    status: str
    duration_hours: float
    created_at: datetime

    class Config:
        from_attributes = True

class ReservationsReport(BaseModel):
    """Report of reservations by period"""
    start_date: date
    end_date: date
    total_reservations: int
    confirmed_count: int
    pending_count: int
    cancelled_count: int
    total_hours_reserved: float
    reservations: List[ReservationReportItem]

# ============================================
# General Statistics
# ============================================

class GeneralStats(BaseModel):
    """General statistics for dashboard"""
    total_users: int
    total_units: int
    total_common_areas: int
    total_reservations_this_month: int
    total_reservations_last_month: int
    most_used_area: Optional[str] = None
    least_used_area: Optional[str] = None
