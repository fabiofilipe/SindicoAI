"""Core domain models: Tenant, User, UserRole."""
import enum

from sqlalchemy import Column, String, Integer, Boolean, ForeignKey, DateTime, func, JSON
from sqlalchemy.orm import relationship

from app.core.database import Base
from app.core.uuid import generate_uuid


class UserRole(str, enum.Enum):
    ADMIN = "admin"
    STAFF = "staff"
    RESIDENT = "resident"


class Tenant(Base):
    __tablename__ = "tenants"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    domain = Column(String, unique=True, index=True)
    address = Column(String)

    phone = Column(String)
    cnpj = Column(String)
    city = Column(String)
    state = Column(String)
    zipcode = Column(String)

    reservation_settings = Column(JSON, default=lambda: {
        "min_hours_advance": 1,
        "max_days_advance": 30,
        "max_hours_duration": 4,
        "cancellation_hours_advance": 24,
    })

    notification_settings = Column(JSON, default=lambda: {
        "email_enabled": True,
        "sms_enabled": False,
        "push_enabled": True,
        "notification_email": "",
        "quiet_hours_start": "22:00",
        "quiet_hours_end": "08:00",
    })

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    users = relationship("User", back_populates="tenant")
    units = relationship("Unit", back_populates="tenant")


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, index=True, nullable=False)
    cpf = Column(String, unique=True, index=True, nullable=True)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    role = Column(String, default=UserRole.RESIDENT.value)
    is_active = Column(Boolean, default=True)

    reset_token = Column(String, nullable=True)
    reset_token_expires = Column(DateTime(timezone=True), nullable=True)
    session_version = Column(Integer, nullable=False, default=0)
    current_refresh_jti = Column(String, nullable=True)

    tenant_id = Column(String, ForeignKey("tenants.id"), nullable=False)
    tenant = relationship("Tenant", back_populates="users")

    unit_id = Column(String, ForeignKey("units.id"), nullable=True)
    unit = relationship("Unit", back_populates="residents")
