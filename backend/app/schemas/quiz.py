from typing import Optional
from pydantic import BaseModel, Field

class QuizBase(BaseModel):
    culture_id: int = Field(..., description="ID of the related culture")
    question: str = Field(
        ...,
        min_length=5,
        max_length=300,
        description="Quiz question text"
    )
    answer: str = Field(
        ...,
        min_length=1,
        max_length=300,
        description="Correct answer text"
    )

class QuizCreate(QuizBase):
    pass

class QuizUpdate(BaseModel):
    question: Optional[str] = Field(
        None,
        min_length=5,
        max_length=300,
        description="Updated question text"
    )
    answer: Optional[str] = Field(
        None,
        min_length=1,
        max_length=300,
        description="Updated answer text"
    )

    class Config:
        orm_mode = True

class QuizOut(QuizBase):
    id: int = Field(..., description="Unique ID of the quiz item")

    class Config:
        orm_mode = True
