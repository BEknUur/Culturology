from sqlalchemy import Column, Integer, String, ForeignKey
from ..database.session import Base

class CultureImage(Base):
    __tablename__ = "culture_images"

    id         = Column(Integer, primary_key=True)
    culture_id = Column(Integer, ForeignKey("cultures.id", ondelete="CASCADE"))
    url        = Column(String, nullable=False)           
    caption    = Column(String(255))                      
