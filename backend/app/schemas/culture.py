
from typing import List, Optional

from pydantic import BaseModel, Field


class Image(BaseModel):
    url: str
    caption: Optional[str] = None

    class Config:
        orm_mode = True


class CultureBase(BaseModel):
    name: str = Field(
        ...,
        min_length=2,
        max_length=100,
        description="Official name of the culture",
    )
    slug: str = Field(
        ...,
        min_length=2,
        max_length=128,
        description="URL-friendly identifier, e.g. 'maori'",
    )
    region: Optional[str] = Field(None, description="Geographical region")
    location: Optional[str] = Field(None, description="Country or territory")
    population: Optional[int] = Field(
        None,
        ge=0,
        description="Approximate population count",
    )
    language: Optional[str] = Field(None, description="Primary language(s)")
    about: Optional[str] = Field(None, description="General overview text")
    traditions: Optional[str] = Field(None, description="Traditions description")
    lifestyle: Optional[str] = Field(None, description="Lifestyle description")
    gallery: List[Image] = []

    class Config:
        orm_mode = True


class CultureCreate(CultureBase):
    pass


class CultureUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    slug: Optional[str] = Field(None, min_length=2, max_length=128)
    region: Optional[str] = None
    location: Optional[str] = None
    population: Optional[int] = Field(None, ge=0)
    language: Optional[str] = None
    about: Optional[str] = None
    traditions: Optional[str] = None
    lifestyle: Optional[str] = None
    gallery: Optional[List[Image]] = None

    class Config:
        orm_mode = True


class CultureOut(CultureBase):
    id: int
