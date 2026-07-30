from sqlalchemy import Column, Integer, String
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)  # Hashed Password Column
    role = Column(String, default="User")
    score = Column(Integer, default=0)
    status = Column(String, default="Low Risk")
    action = Column(String, default="Normal Activity")

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    time = Column(String, default=lambda: datetime.now().strftime("%I:%M %p"))
    msg = Column(String, nullable=False)
    level = Column(String, default="Info")