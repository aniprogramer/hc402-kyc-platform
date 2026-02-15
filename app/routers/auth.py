from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.db_user import User
from app.models.schemas import UserCreate, UserLogin
from app.services.auth import hash_password, verify_password, create_access_token
import uuid

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user: UserCreate, db: Session = Depends(get_db)):
    # 1. Check if email already exists
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    # 2. Use a UUID for kyc_id to match our frontend "HC-XXXX" vibe
    kyc_id = f"HC-{uuid.uuid4().hex[:8].upper()}"

    new_user = User(
        user_id=kyc_id,  # This maps to the session id in NextAuth
        full_name=user.username,
        email=user.email,
        hashed_password=hash_password(user.password),
        status="active"
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully", 
        "kyc_id": new_user.user_id,
        "email": new_user.email
    }

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid email or password"
        )

    # 3. Create the token
    token = create_access_token({"sub": db_user.email})

    # 4. Return EXACTLY what NextAuth lib/auth.ts expects
    return {
        "access_token": token,
        "token_type": "bearer",
        "kyc_id": db_user.user_id,
        "full_name": db_user.full_name,
        "email": db_user.email
    }