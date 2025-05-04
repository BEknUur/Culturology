from sqlalchemy import Column, Integer, String, ForeignKey
from ..database.session import Base

class Quiz(Base):
    __tablename__ = "quizzes"

    id          = Column(Integer, primary_key=True, index=True)
    culture_id  = Column(Integer, ForeignKey("cultures.id", ondelete="CASCADE"))
    question    = Column(String, nullable=False)
    answer      = Column(String, nullable=False)
