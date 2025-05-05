from sqlalchemy import Column, Integer, String, Text
from ..database.session import Base

class MediaItem(Base):
    __tablename__ = "media_items"
    id            = Column(Integer, primary_key=True, index=True)
    type          = Column(String(10), nullable=False, index=True)  
    url           = Column(String, nullable=False)                  
    thumbnail     = Column(String, nullable=True)                  
    caption       = Column(Text,   nullable=True)                   
    subtitles_url = Column(String, nullable=True)                   
    duration      = Column(Integer, nullable=True)                 
