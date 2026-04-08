"""Event domain models: Event, EventRSVP."""
from sqlalchemy import Column, String, Text, Integer, Boolean, DateTime, ForeignKey, UniqueConstraint, func
from sqlalchemy.orm import relationship

from app.core.database import Base
from app.core.uuid import generate_uuid


class Event(Base):
    __tablename__ = "events"

    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String, nullable=False)
    description = Column(Text)
    event_date = Column(DateTime(timezone=True), nullable=False)
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=False)
    location = Column(String)
    capacity = Column(Integer)
    status = Column(String, default="scheduled")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    common_area_id = Column(String, ForeignKey("common_areas.id"), nullable=True)
    common_area = relationship("CommonArea")

    tenant_id = Column(String, ForeignKey("tenants.id"), nullable=False)
    tenant = relationship("Tenant")

    created_by = Column(String, ForeignKey("users.id"), nullable=False)
    creator = relationship("User", foreign_keys=[created_by])

    rsvps = relationship("EventRSVP", back_populates="event", cascade="all, delete-orphan")


class EventRSVP(Base):
    __tablename__ = "event_rsvps"

    id = Column(String, primary_key=True, default=generate_uuid)
    response = Column(String, default="attending")
    attended = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    event_id = Column(String, ForeignKey("events.id", ondelete="CASCADE"), nullable=False)
    event = relationship("Event", back_populates="rsvps")

    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    user = relationship("User")

    tenant_id = Column(String, ForeignKey("tenants.id"), nullable=False)
    tenant = relationship("Tenant")

    __table_args__ = (
        UniqueConstraint("event_id", "user_id", name="uq_event_user_rsvp"),
    )
