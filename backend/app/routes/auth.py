# ROUTES AUTH
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.models import User
from app.schemas.schemas import UserCreate, Token
from app.core.auth import hash_password, verify_password, create_token

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register", status_code=201)
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user.email).first()
    if existing: raise HTTPException(status_code=400, detail="User already exists")
    db_user = User(email=user.email, password=hash_password(user.password))
    db.add(db_user)
    db.commit()
    return {"msg": "user created"}

# This is the "Login" endpoint your frontend calls to get a token
@router.post("/login", response_model=Token)
def login(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    token = create_token({"sub": db_user.email})
    # Send the token back to the frontend to be stored in the 'token' variable
    return {"access_token": token, "token_type": "bearer"}