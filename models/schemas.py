from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# --- AUTH SCHEMAS ---
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# --- RESPONSE SCHEMAS (Sanitized for Frontend) ---
class UserResponse(BaseModel):
    user_id: str
    full_name: str
    email: EmailStr
    status: str
    created_at: datetime

    class Config:
        from_attributes = True 

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    kyc_id: str
    full_name: str
    email: EmailStr

# --- KYC SCHEMAS ---
class UserKYCUpdate(BaseModel):
    document_type: str
    document_number: str