from pydantic import BaseModel
from typing import Optional

class Token(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str

class TokenPayload(BaseModel):
    sub: Optional[str] = None
    type: Optional[str] = None
    sv: int = 0
    jti: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class TokenRefreshRequest(BaseModel):
    refresh_token: Optional[str] = None
