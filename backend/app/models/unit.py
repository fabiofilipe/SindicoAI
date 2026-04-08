"""Unit domain model."""
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship

from app.core.database import Base
from app.core.uuid import generate_uuid


class Unit(Base):
    __tablename__ = "units"

    id = Column(String, primary_key=True, default=generate_uuid)
    block = Column(String)
    number = Column(String, nullable=False)
    floor = Column(Integer, nullable=True)
    type = Column(String, nullable=True)
    authorized_cpfs = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    tenant_id = Column(String, ForeignKey("tenants.id"), nullable=False)
    tenant = relationship("Tenant", back_populates="units")

    residents = relationship("User", back_populates="unit")
