"""CommonArea domain model."""
from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship

from app.core.database import Base
from app.core.uuid import generate_uuid


class CommonArea(Base):
    __tablename__ = "common_areas"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    description = Column(String)
    capacity = Column(Integer)
    opening_time = Column(String)
    closing_time = Column(String)
    is_active = Column(Boolean, default=True)

    tenant_id = Column(String, ForeignKey("tenants.id"), nullable=False)
    tenant = relationship("Tenant")

    reservations = relationship("Reservation", back_populates="common_area")
