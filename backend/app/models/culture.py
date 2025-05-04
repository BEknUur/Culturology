# backend/app/models/culture.py
from sqlalchemy import Column, Integer, String, Text, Float
from sqlalchemy.orm import relationship
from ..database.session import Base

class Culture(Base):
    __tablename__ = "cultures"
    latitude   = Column(Float)   #  -38.084
    longitude  = Column(Float)   # 174.808
    id          = Column(Integer, primary_key=True, index=True)
    slug        = Column(String(128), unique=True, index=True)       # /cultures/maori
    name        = Column(String(100),  nullable=False, index=True)
    region      = Column(String(100))                                # Oceania, Arctic …
    location    = Column(String(150))                                # New Zealand (Aotearoa)
    population  = Column(Integer)                                    # ~850000
    language    = Column(String(150))                                # Te Reo Māori
    about       = Column(Text)
    traditions  = Column(Text)
    lifestyle   = Column(Text)

    
    gallery = relationship("CultureImage", cascade="all, delete-orphan")
