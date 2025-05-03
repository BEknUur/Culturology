from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, SQLModel, select
from app.db import get_session, engine
from app.models import People
from app.schemas import PeopleRead

router = APIRouter(tags=["peoples"])

@router.on_event("startup")
def tables():
    SQLModel.metadata.create_all(engine)

@router.get("/peoples", response_model=List[PeopleRead])
def list_peoples(q: Optional[str] = Query(None), session: Session = Depends(get_session)):
    stmt = select(People)
    if q:
        like = f"%{q.lower()}%"
        stmt = stmt.where(People.name.ilike(like))
    return session.exec(stmt).all()

@router.get("/peoples/{pid}", response_model=PeopleRead)
def get_people(pid: str, session: Session = Depends(get_session)):
    obj = session.get(People, pid)
    if not obj:
        raise HTTPException(404)
    return obj