import os
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv

# Project root directory
BASE_DIR = Path(__file__).resolve().parent.parent
env_path = BASE_DIR / ".env"

# Load .env file
if env_path.exists():
    load_dotenv(dotenv_path=env_path)
else:
    load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Check if DATABASE_URL exists
if not DATABASE_URL:
    raise ValueError(
        "\n❌ ERROR: DATABASE_URL not found in .env file!\n"
        "Please add:\n"
        "DATABASE_URL=postgresql://...\n"
    )

# Convert old postgres:// URL if needed
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace(
        "postgres://",
        "postgresql://",
        1
    )

# SQLAlchemy Engine (Optimized for Neon PostgreSQL)
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,      # Check connection before using
    pool_recycle=300,        # Reconnect every 5 minutes
    pool_size=5,
    max_overflow=10,
    pool_timeout=30,
    pool_reset_on_return="rollback",
    echo=False,
)

# Session Factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

# Base Model
Base = declarative_base()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()