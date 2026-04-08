"""Notification domain model."""
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship

from app.core.database import Base
from app.core.uuid import generate_uuid


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String, nullable=False)
    message = Column(String, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    scheduled_for = Column(DateTime(timezone=True), nullable=True)
    sent_at = Column(DateTime(timezone=True), nullable=True)

    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    user = relationship("User")

    tenant_id = Column(String, ForeignKey("tenants.id"), nullable=False)
    tenant = relationship("Tenant")
