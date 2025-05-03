from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select
from app.db import get_session
from app.models import Culture
from app.schemas import CultureRead

router = APIRouter(tags=["cultures"])

@router.get("/cultures", response_model=List[CultureRead])
def list_cultures(q: Optional[str] = Query(None), session: Session = Depends(get_session)):
    stmt = select(Culture)
    if q:
        stmt = stmt.where(Culture.overview.ilike(f"%{q}%"))
    return session.exec(stmt).all()

@router.get("/cultures/{pid}", response_model=CultureRead)
def get_culture(pid: str, session: Session = Depends(get_session)):
    obj = session.get(Culture, pid)
    if not obj:
        raise HTTPException(404)
    return obj