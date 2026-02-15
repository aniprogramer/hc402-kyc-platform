from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from database import Base # 👈 Adjusted for Main Branch structure

class StatusLog(Base):
    __tablename__ = "status_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True) 
    old_status = Column(String)
    new_status = Column(String)
    change_reason = Column(String, nullable=True) 
    changed_at = Column(DateTime, default=datetime.utcnow)