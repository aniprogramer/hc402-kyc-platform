from sqlalchemy import Column, String, DateTime, Integer
from datetime import datetime
from app.db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, unique=True, index=True)   # <-- add this back
    full_name = Column(String)
    email = Column(String, unique=True, index=True)
    document_type = Column(String)
    document_number = Column(String)
    status = Column(String, default="pending")
    hashed_password = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
