from pydantic import BaseModel, EmailStr
from typing import Optional

class TenantOnboardingRequest(BaseModel):
    # Tenant (Condominium) data
    tenant_name: str
    tenant_address: Optional[str] = None
    
    # Admin user data
    admin_email: EmailStr
    admin_password: str
    admin_full_name: str
    admin_cpf: Optional[str] = None

class TenantOnboardingResponse(BaseModel):
    message: str
    tenant_id: str
    admin_user_id: str
    access_token: str
    token_type: str = "bearer"
