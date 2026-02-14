from sqlalchemy import Column, String, Float
from database import Base

class KYCSession(Base):
    __tablename__ = "kyc_sessions"

    kyc_id = Column(String, primary_key=True, index=True)
    ocr_confidence = Column(Float)
    face_match_score = Column(Float)
    status = Column(String)
