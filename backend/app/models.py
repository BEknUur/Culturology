from typing import List, Optional
from sqlalchemy import Column
from sqlalchemy.types import JSON as SQLJSON
from sqlmodel import Field, Relationship, SQLModel

class People(SQLModel, table=True):
    id: str = Field(primary_key=True)
    name: str
    tagline: Optional[str] = None
    cover: Optional[str] = None
    description: str
    facts: List[str] = Field(default_factory=list, sa_column=Column(SQLJSON))
    images: List[str] = Field(default_factory=list, sa_column=Column(SQLJSON))
    
    culture: Optional["Culture"] = Relationship(back_populates="people")

class Culture(SQLModel, table=True):
    people_id: str = Field(foreign_key="people.id", primary_key=True)
    overview: str
    people: People = Relationship(back_populates="culture")


class MapMarker(SQLModel, table=True):
    id: str = Field(primary_key=True)
    name: str
    lat: float
    lon: float
    people_id: str = Field(foreign_key="people.id")

class Quiz(SQLModel, table=True):
    id: str = Field(primary_key=True)
    title: str
    people_id: str = Field(foreign_key="people.id")
    questions: list["Question"] = Relationship(back_populates="quiz")

class Question(SQLModel, table=True):
    id: str = Field(primary_key=True)
    quiz_id: str = Field(foreign_key="quiz.id")
    text: str
    options: list[str] = Field(sa_column=Column(SQLJSON))
    correct: list[int] = Field(sa_column=Column(SQLJSON))
    quiz: Quiz = Relationship(back_populates="questions")
