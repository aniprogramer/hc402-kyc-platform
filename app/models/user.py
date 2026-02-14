from pydantic import BaseModel, EmailStr

class UserKYC(BaseModel):
    user_id: str
    full_name: str
    email: EmailStr   
    document_type: str
    document_number: str
    status: str = "pending"
