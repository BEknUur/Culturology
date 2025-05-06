from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from ..database.session import get_db
from ..models.media_item import MediaItem as MediaItemModel
from ..schemas.media import MediaItemCreate, MediaItemOut

router = APIRouter(prefix="/api/media", tags=["media"])

@router.post(
    "/",
    response_model=MediaItemOut,
    status_code=status.HTTP_201_CREATED,
    summary="Создать новый медиа-объект",
)
def create_media(
    payload: MediaItemCreate,
    db: Session = Depends(get_db),
):
    
    db_item = MediaItemModel(
        type=payload.type,
        url=str(payload.url),
        thumbnail=str(payload.thumbnail) if payload.thumbnail else None,
        caption=payload.caption,
        subtitles_url=str(payload.subtitles_url) if payload.subtitles_url else None,
        duration=payload.duration,
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.get("/", response_model=List[MediaItemOut])
def list_media(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    return db.query(MediaItemModel).offset(skip).limit(limit).all()

@router.get("/{item_id}", response_model=MediaItemOut)
def get_media(item_id: int, db: Session = Depends(get_db)):
    item = db.query(MediaItemModel).get(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Media item not found")
    return item

@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_media(item_id: int, db: Session = Depends(get_db)):
    item = db.query(MediaItemModel).get(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Media item not found")
    db.delete(item)
    db.commit()
