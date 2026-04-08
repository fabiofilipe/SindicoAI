"""Reservation domain model."""
from sqlalchemy import Column, String, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship

from app.core.database import Base
from app.core.uuid import generate_uuid


class Reservation(Base):
    __tablename__ = "reservations"

    id = Column(String, primary_key=True, default=generate_uuid)
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=False)
    status = Column(String, default="confirmed")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    common_area_id = Column(String, ForeignKey("common_areas.id"), nullable=False)
    common_area = relationship("CommonArea", back_populates="reservations")

    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    user = relationship("User")

    unit_id = Column(String, ForeignKey("units.id"), nullable=False)
    unit = relationship("Unit")

    tenant_id = Column(String, ForeignKey("tenants.id"), nullable=False)
    tenant = relationship("Tenant")
