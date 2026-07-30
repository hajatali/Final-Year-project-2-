import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import text

import models
from database import engine, get_db
import auth

app = FastAPI(title="DataGuard Backend Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    role: str = "Developer"

class LoginRequest(BaseModel):
    email: str
    password: str

class UserRiskResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    score: int
    status: str
    action: str

    class Config:
        from_attributes = True

class AlertResponse(BaseModel):
    id: int
    time: str
    msg: str
    level: str

    class Config:
        from_attributes = True


@app.on_event("startup")
def seed_initial_data():
    models.Base.metadata.create_all(bind=engine)
    
    db = next(get_db())
    try:
        # Check if users already seeded
        existing_user = db.query(models.User).filter(models.User.email == "hajat@dataguard.com").first()
        
        if not existing_user:
            hashed_admin_pass = auth.get_password_hash("admin123")
            
            sample_users = [
                models.User(
                    name="Hajat Ali",
                    email="hajat@dataguard.com",
                    hashed_password=hashed_admin_pass,
                    role="Admin",
                    score=5,
                    status="Low Risk",
                    action="System Config Update"
                ),
                models.User(
                    name="Anis Akram",
                    email="anis@dataguard.com",
                    hashed_password=hashed_admin_pass,
                    role="Manager",
                    score=88,
                    status="High Risk",
                    action="Mass File Download"
                )
            ]
            db.add_all(sample_users)
            
            if not db.query(models.Alert).first():
                sample_alerts = [
                    models.Alert(time="10:42 AM", msg="Anis Akram downloaded 50 encrypted blobs in 1 min.", level="Critical"),
                    models.Alert(time="09:15 AM", msg="New AES-256 session key generated for Vault.", level="Info")
                ]
                db.add_all(sample_alerts)
                
            db.commit()
            print(">>> DATABASE SEEDED SUCCESSFULLY! <<<")
        else:
            print(">>> DATABASE ALREADY CONTAINS USERS <<<")
            
    except Exception as e:
        print("Startup Seeding Exception:", e)
        db.rollback()
    finally:
        db.close()

@app.get("/")
def health_check():
    return {"status": "online", "system": "DataGuard Backend Engine v0.1.0"}

@app.post("/api/register", status_code=status.HTTP_201_CREATED)
def register_user(user_data: UserRegister, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pwd = auth.get_password_hash(user_data.password)
    new_user = models.User(
        name=user_data.name,
        email=user_data.email,
        hashed_password=hashed_pwd,
        role=user_data.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    access_token = auth.create_access_token(data={"sub": new_user.email, "role": new_user.role})
    
    return {
        "status": "success",
        "message": "User registered successfully",
        "token": access_token,
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email,
            "role": new_user.role
        }
    }

@app.post("/api/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == data.email).first()
    
    if not user or not auth.verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    access_token = auth.create_access_token(data={"sub": user.email, "role": user.role})
    
    return {
        "status": "success",
        "message": "Login successful",
        "token": access_token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        }
    }

@app.get("/api/users/risk-scores", response_model=List[UserRiskResponse])
def get_user_risk_scores(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    return db.query(models.User).all()

@app.get("/api/alerts", response_model=List[AlertResponse])
def get_live_alerts(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    return db.query(models.Alert).all()