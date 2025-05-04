
from sqlalchemy import Column, Integer, String, Text, Float
from sqlalchemy.orm import relationship
from ..database.session import Base

class Culture(Base):
    __tablename__ = "cultures"
    latitude   = Column(Float)   
    longitude  = Column(Float)   
    id          = Column(Integer, primary_key=True, index=True)
    slug        = Column(String(128), unique=True, index=True)       
    name        = Column(String(100),  nullable=False, index=True)
    region      = Column(String(100))                                
    location    = Column(String(150))                                
    population  = Column(Integer)                                   
    language    = Column(String(150))                               
    about       = Column(Text)
    traditions  = Column(Text)
    lifestyle   = Column(Text)

    
    gallery = relationship("CultureImage", cascade="all, delete-orphan")
