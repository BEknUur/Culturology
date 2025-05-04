from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://culturology_user:password@localhost:5432/culturology",
)

# 1️⃣ СОЗДАЁМ Base здесь
Base = declarative_base()

# 2️⃣ Движок и сессии
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 3️⃣ Генератор для Depends
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
