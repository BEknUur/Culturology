from typing import List, Optional
from pydantic import BaseModel

class PeopleRead(BaseModel):
    id: str
    name: str
    tagline: Optional[str]
    cover: Optional[str]
    description: str
    facts: List[str]
    images: List[str]
    
    class Config: orm_mode = True

class PeopleCreate(PeopleRead):
    pass

class PeopleUpdate(BaseModel):
    name: Optional[str] = None
    tagline: Optional[str] = None
    cover: Optional[str] = None
    description: Optional[str] = None
    facts: Optional[List[str]] = None
    images: Optional[List[str]] = None
    

class CultureRead(BaseModel):
    people_id: str
    overview: str
    class Config: orm_mode = True

class CultureCreate(CultureRead):
    pass

class CultureUpdate(BaseModel):
    overview: Optional[str] = None
    



class MapMarkerRead(BaseModel):
    id: str
    name: str
    lat: float
    lon: float
    people_id: str
    class Config: orm_mode = True

class MapMarkerCreate(MapMarkerRead): pass


class QuestionRead(BaseModel):
    id: str
    quiz_id: str
    text: str
    options: list[str]
    class Config: orm_mode = True

class QuizRead(BaseModel):
    id: str
    title: str
    people_id: str
    questions: list[QuestionRead]
    class Config: orm_mode = True

class AnswerRequest(BaseModel):
    answers: list[int]

class AnswerResponse(BaseModel):
    correct: bool
