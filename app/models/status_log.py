from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.db.database import Base

class StatusLog(Base):
    __tablename__ = "status_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String)
    old_status = Column(String)
    new_status = Column(String)
    changed_at = Column(DateTime, default=datetime.utcnow)
