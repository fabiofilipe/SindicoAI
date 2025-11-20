from pydantic import BaseModel, EmailStr
from typing import Optional
import uuid

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    is_active: Optional[bool] = True
    role: str = "resident"

class UserCreate(UserBase):
    password: str
    tenant_id: str
    unit_id: Optional[str] = None

class UserUpdate(UserBase):
    password: Optional[str] = None

class UserInDBBase(UserBase):
    id: str
    tenant_id: str
    unit_id: Optional[str] = None

    class Config:
        from_attributes = True

class User(UserInDBBase):
    pass

class UserInDB(UserInDBBase):
    hashed_password: str

# User management schemas
class UserResponse(BaseModel):
    id: str
    email: EmailStr
    cpf: Optional[str] = None
    full_name: Optional[str] = None
    role: str
    is_active: bool
    tenant_id: str
    unit_id: Optional[str] = None

    class Config:
        from_attributes = True

class PasswordResetRequest(BaseModel):
    new_password: str
