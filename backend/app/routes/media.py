from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..database.session import get_db
from ..models.media_item import MediaItem
from ..schemas.media import MediaItemCreate, MediaItemOut

router = APIRouter(prefix="/api/media", tags=["media"])

@router.get("/", response_model=List[MediaItemOut])
def list_media(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    return db.query(MediaItem).offset(skip).limit(limit).all()

@router.get("/{item_id}", response_model=MediaItemOut)
def get_media(item_id: int, db: Session = Depends(get_db)):
    item = db.query(MediaItem).get(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Media item not found")
    return item

@router.post("/", response_model=MediaItemOut, status_code=status.HTTP_201_CREATED)
def create_media(payload: MediaItemCreate, db: Session = Depends(get_db)):
    item = MediaItem(**payload.dict())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_media(item_id: int, db: Session = Depends(get_db)):
    item = db.query(MediaItem).get(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Media item not found")
    db.delete(item)
    db.commit()
