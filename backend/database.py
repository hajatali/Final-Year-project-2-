import os
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Project Root directory se .env file ko automatically locate karne ke liye
BASE_DIR = Path(__file__).resolve().parent.parent
env_path = BASE_DIR / ".env"

# Explicit path ke sath load karein (Agar pehla rasta fail ho toh current folder try karein)
if env_path.exists():
    load_dotenv(dotenv_path=env_path)
else:
    load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Diagnostic Check: Direct clear error message agar URL Na mile
if not DATABASE_URL:
    raise ValueError(
        "\n\n❌ ERROR: DATABASE_URL variable .env file mein nahi mila!\n"
        "Please check karein ke aapki .env file mein line majood hai:\n"
        "DATABASE_URL=postgresql://...\n"
    )

# Neon PostgreSQL integration fix for SQLAlchemy (postgres:// -> postgresql://)
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()