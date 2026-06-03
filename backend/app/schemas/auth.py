from typing import Optional
from pydantic import BaseModel, Field
from app.schemas.user import UserResponse

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class GoogleLoginRequest(BaseModel):
    id_token: str = Field(..., description="Google ID Token received by the React Native client")

class AppleLoginRequest(BaseModel):
    id_token: str = Field(..., description="Apple Identity Token received by the React Native client")
    first_name: Optional[str] = None
    last_name: Optional[str] = None

class PhoneLoginRequest(BaseModel):
    phone: str = Field(..., example="+998901234567")
    password: str = Field(..., min_length=6)

class PhoneRegisterRequest(BaseModel):
    name: str = Field(..., min_length=2)
    phone: str = Field(..., example="+998901234567")
    password: str = Field(..., min_length=6)
