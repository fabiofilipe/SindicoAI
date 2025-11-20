from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from app.core.database import Base
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class Tenant(Base):
    __tablename__ = "tenants"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    address = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    users = relationship("User", back_populates="tenant")
    units = relationship("Unit", back_populates="tenant")

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    role = Column(String, default="resident") # resident, admin, staff
    is_active = Column(Boolean, default=True)
    
    tenant_id = Column(String, ForeignKey("tenants.id"), nullable=False)
    tenant = relationship("Tenant", back_populates="users")
    
    unit_id = Column(String, ForeignKey("units.id"), nullable=True)
    unit = relationship("Unit", back_populates="residents")

class Unit(Base):
    __tablename__ = "units"

    id = Column(String, primary_key=True, default=generate_uuid)
    block = Column(String)
    number = Column(String, nullable=False)
    
    tenant_id = Column(String, ForeignKey("tenants.id"), nullable=False)
    tenant = relationship("Tenant", back_populates="units")
    
    residents = relationship("User", back_populates="unit")

class CommonArea(Base):
    __tablename__ = "common_areas"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    description = Column(String)
    capacity = Column(Integer)
    opening_time = Column(String)  # Format: "08:00"
    closing_time = Column(String)  # Format: "22:00"
    is_active = Column(Boolean, default=True)
    
    tenant_id = Column(String, ForeignKey("tenants.id"), nullable=False)
    tenant = relationship("Tenant")
    
    reservations = relationship("Reservation", back_populates="common_area")

class Reservation(Base):
    __tablename__ = "reservations"

    id = Column(String, primary_key=True, default=generate_uuid)
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=False)
    status = Column(String, default="confirmed")  # confirmed, cancelled
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    common_area_id = Column(String, ForeignKey("common_areas.id"), nullable=False)
    common_area = relationship("CommonArea", back_populates="reservations")
    
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    user = relationship("User")
    
    unit_id = Column(String, ForeignKey("units.id"), nullable=False)
    unit = relationship("Unit")
    
    tenant_id = Column(String, ForeignKey("tenants.id"), nullable=False)
    tenant = relationship("Tenant")

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String, nullable=False)
    message = Column(String, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    user = relationship("User")
    
    tenant_id = Column(String, ForeignKey("tenants.id"), nullable=False)
    tenant = relationship("Tenant")

