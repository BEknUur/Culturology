from typing import Literal, Dict
from typing import Optional
from pydantic import BaseModel, Field

class QuizBase(BaseModel):
    culture_id: int = Field(..., description="ID of the related culture")
    question:   str = Field(..., min_length=5, max_length=300)
    answer:     str = Field(..., min_length=1, max_length=300)

class QuizCreate(QuizBase):
    pass

class QuizUpdate(BaseModel):
    question: Optional[str] = Field(None, min_length=5, max_length=300)
    answer:   Optional[str] = Field(None, min_length=1, max_length=300)

    class Config:
        orm_mode = True

class QuizOut(QuizBase):
    id: int

    class Config:
        orm_mode = True



class QuizItem(BaseModel):
    id:       int                       = Field(..., description="Номер вопроса")
    question: str                       = Field(..., description="Текст вопроса")
    options:  Dict[Literal["A","B","C","D"], str] = Field(..., description="Варианты ответов")
    correct:  Literal["A","B","C","D"]  = Field(..., description="Правильный вариант")

    class Config:
        orm_mode = True
