from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
import re

class UserRegisterRequest(BaseModel):
    email: EmailStr
    cpf: str
    password: str
    full_name: str
    unit_number: str
    tenant_name: str  # Nome do condomínio para identificação
    
    @field_validator('cpf')
    @classmethod
    def validate_cpf(cls, v):
        # Remove non-numeric characters
        cpf = re.sub(r'\D', '', v)
        
        if len(cpf) != 11:
            raise ValueError('CPF must have 11 digits')
        
        # Basic validation (all same digits)
        if cpf == cpf[0] * 11:
            raise ValueError('Invalid CPF')
        
        return cpf

class UserRegisterResponse(BaseModel):
    message: str
    user_id: str
