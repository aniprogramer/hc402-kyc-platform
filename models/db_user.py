from sqlalchemy import Column, String, DateTime, Integer
from datetime import datetime
from database import Base # 👈 Adjusted for Main Branch structure

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    
    document_type = Column(String, nullable=True)
    document_number = Column(String, nullable=True)
    
    status = Column(String, default="pending")
    hashed_password = Column(String, nullable=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)