
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from app.db import get_session
from app.core.security import require_admin
from app.models import People, Culture
from app.schemas import PeopleCreate, PeopleUpdate, CultureCreate, CultureUpdate

router = APIRouter(prefix="/admin", tags=["admin"], dependencies=[Depends(require_admin)])


@router.post("/people", response_model=PeopleCreate)
def create_people(data: PeopleCreate, s: Session = Depends(get_session)):
    if s.get(People, data.id):
        raise HTTPException(409, "ID exists")
    obj = People(**data.dict())
    s.add(obj); s.commit(); s.refresh(obj)
    return obj

@router.put("/people/{pid}", response_model=PeopleCreate)
def update_people(pid: str, data: PeopleUpdate, s: Session = Depends(get_session)):
    obj = s.get(People, pid);  _404(obj)
    for k, v in data.dict(exclude_unset=True).items():
        setattr(obj, k, v)
    s.add(obj); s.commit(); s.refresh(obj)
    return obj

@router.delete("/people/{pid}")
def del_people(pid: str, s: Session = Depends(get_session)):
    obj = s.get(People, pid);  _404(obj)
    s.delete(obj); s.commit(); return {"ok": True}


@router.post("/culture", response_model=CultureCreate)
def create_culture(data: CultureCreate, s: Session = Depends(get_session)):
    if s.get(Culture, data.people_id): raise HTTPException(409)
    obj = Culture(**data.dict())
    s.add(obj); s.commit(); s.refresh(obj); return obj

@router.put("/culture/{pid}", response_model=CultureCreate)
def upd_culture(pid: str, data: CultureUpdate, s: Session = Depends(get_session)):
    obj = s.get(Culture, pid); _404(obj)
    for k, v in data.dict(exclude_unset=True).items(): setattr(obj, k, v)
    s.add(obj); s.commit(); s.refresh(obj); return obj

@router.delete("/culture/{pid}")
def del_culture(pid: str, s: Session = Depends(get_session)):
    obj = s.get(Culture, pid); _404(obj)
    s.delete(obj); s.commit(); return {"ok": True}

def _404(o): 
    if not o: raise HTTPException(404)
