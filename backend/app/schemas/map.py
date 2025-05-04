from pydantic import BaseModel, Field

class CulturePoint(BaseModel):
    slug: str = Field(..., description="URL-friendly identifier, e.g. 'maori'")
    name: str = Field(..., description="Display name of the culture")
    lat: float = Field(..., description="Latitude coordinate")
    lng: float = Field(..., description="Longitude coordinate")

    class Config:
        orm_mode = True
