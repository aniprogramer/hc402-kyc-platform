from sqlalchemy import Column, String, DateTime
from datetime import datetime
from app.db.database import Base

class User(Base):
    __tablename__ = "users"

    user_id = Column(String, primary_key=True, index=True)
    full_name = Column(String)
    email = Column(String)
    document_type = Column(String)
    document_number = Column(String)
    status = Column(String, default="pending")

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
