from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI(title="DataGuard Backend Engine")

# CORS Setup - Development ke liye sab domains allow kar rahe hain
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Har frontend origin se request accept karega
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Models
class LoginRequest(BaseModel):
    email: str
    password: str

# Response Models
class UserRiskResponse(BaseModel):
    id: int
    name: str
    role: str
    score: int
    status: str
    action: str

class AlertResponse(BaseModel):
    id: int
    time: str
    msg: str
    level: str


# 🔑 0. Endpoint: Login Endpoint (ADDED FIX)
@app.post("/api/login")
def login(data: LoginRequest):
    # Dummy authentication logic (Phase 3 mein DB / Password Hashing aayegi)
    if data.email and data.password:
        return {
            "status": "success",
            "message": "Login successful",
            "token": "dataguard_jwt_secret_token_2026",
            "user": {
                "name": "Hajat Ali",
                "email": data.email,
                "role": "Admin"
            }
        }
    raise HTTPException(status_code=400, detail="Invalid credentials")


# 1. Endpoint: Fetch Dynamic User Risk Scores
@app.get("/api/users/risk-scores", response_model=List[UserRiskResponse])
def get_user_risk_scores():
    return [
        {
            "id": 1,
            "name": "Anis Akram",
            "role": "Manager",
            "score": 88,
            "status": "High Risk",
            "action": "Mass File Download"
        },
        {
            "id": 2,
            "name": "Muhammad Wahaj",
            "role": "Developer",
            "score": 12,
            "status": "Low Risk",
            "action": "Normal Login"
        },
        {
            "id": 3,
            "name": "Parshant Raja",
            "role": "Analyst",
            "score": 45,
            "status": "Medium Risk",
            "action": "Odd Login Time"
        },
        {
            "id": 4,
            "name": "Hajat Ali",
            "role": "Admin",
            "score": 5,
            "status": "Low Risk",
            "action": "System Config Update"
        }
    ]


# 2. Endpoint: Fetch Live Security Alerts
@app.get("/api/alerts", response_model=List[AlertResponse])
def get_live_alerts():
    return [
        {
            "id": 101,
            "time": "10:42 AM",
            "msg": "Anis Akram downloaded 50 encrypted blobs in 1 min.",
            "level": "Critical"
        },
        {
            "id": 102,
            "time": "09:15 AM",
            "msg": "New AES-256 session key generated for Vault.",
            "level": "Info"
        }
    ]