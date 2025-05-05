from typing import Literal, Optional
from pydantic import BaseModel, HttpUrl, Field

class MediaItemBase(BaseModel):
    type: Literal["video", "audio"] = Field(..., description="Тип медиа")
    url: HttpUrl                      = Field(..., description="URL видео или аудио")
    thumbnail: Optional[HttpUrl]      = Field(None, description="URL превью (для видео)")
    caption: Optional[str]            = Field(None, description="Текстовая подпись или описание")
    subtitles_url: Optional[HttpUrl]  = Field(None, description="URL субтитров (WebVTT/SRT)")
    duration: Optional[int]           = Field(None, description="Длительность в секундах")

class MediaItemCreate(MediaItemBase):
    pass

class MediaItemOut(MediaItemBase):
    id: int = Field(..., description="ID медиа-объекта")

    class Config:
        orm_mode = True
