from typing import List
from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from app.db import get_session
from app.models import MapMarker
from app.schemas import MapMarkerRead, MapMarkerCreate
from app.core.security import require_admin

router = APIRouter(prefix="/map", tags=["map"])

@router.get("/markers", response_model=List[MapMarkerRead])
def get_markers(s: Session = Depends(get_session)):
    return s.exec(select(MapMarker)).all()

@router.post("/markers", response_model=MapMarkerRead, dependencies=[Depends(require_admin)])
def add_marker(data: MapMarkerCreate, s: Session = Depends(get_session)):
    obj = MapMarker(**data.dict())
    s.add(obj); s.commit(); s.refresh(obj); return obj
