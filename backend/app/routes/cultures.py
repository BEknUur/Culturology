from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, distinct

from ..database.session import get_db
from ..models.culture import Culture
from ..models.culture_image import CultureImage
from ..schemas.culture import CultureCreate, CultureUpdate, CultureOut

router = APIRouter()


@router.get("/regions", response_model=list[str], tags=["cultures"])
def list_regions(db: Session = Depends(get_db)):
    
    rows = (
        db
        .query(distinct(Culture.region))
        .filter(Culture.region.isnot(None))
        .all()
    )
    
    return [r[0] for r in rows]

@router.get("/search", response_model=list[CultureOut])
def search_cultures(
    query: str | None = Query(
        None,
        min_length=1,
        description="Search term across name, region, location, language, etc.",
    ),
    region: str | None = Query(None, description="Filter by region"),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1),
    db: Session = Depends(get_db),
):
    q = db.query(Culture)

    
    if query:
        term = f"%{query.lower()}%"
        q = q.filter(
            or_(
                Culture.name.ilike(term),
                Culture.slug.ilike(term),
                Culture.region.ilike(term),
                Culture.location.ilike(term),
                Culture.language.ilike(term),
                Culture.about.ilike(term),
                Culture.traditions.ilike(term),
                Culture.lifestyle.ilike(term),
            )
        )

   
    if region:
        reg = f"%{region.lower()}%"
        q = q.filter(Culture.region.ilike(reg))

 
    results = q.offset(skip).limit(limit).all()
    return results


def create_images(db: Session, culture: Culture, images):
    for img in images:
        db.add(CultureImage(culture_id=culture.id, **img.dict()))

@router.post("/", response_model=CultureOut, status_code=status.HTTP_201_CREATED)
def create_culture(payload: CultureCreate, db: Session = Depends(get_db)):
    if db.query(Culture).filter(Culture.slug == payload.slug).first():
        raise HTTPException(409, "Slug already exists")
    culture = Culture(**payload.dict(exclude={"gallery"}))
    db.add(culture)
    db.flush()
    create_images(db, culture, payload.gallery)
    db.commit()
    db.refresh(culture)
    return culture

@router.get("/", response_model=list[CultureOut])
def list_cultures(skip: int = 0, limit: int = 12, db: Session = Depends(get_db)):
    return db.query(Culture).offset(skip).limit(limit).all()

@router.get("/{slug}", response_model=CultureOut)
def get_by_slug(slug: str, db: Session = Depends(get_db)):
    culture = db.query(Culture).filter(Culture.slug == slug).first()
    if not culture:
        raise HTTPException(404, "Culture not found")
    return culture

@router.put("/{slug}", response_model=CultureOut)
def update_culture(
    slug: str,
    payload: CultureUpdate,
    db: Session = Depends(get_db),
):
    culture = db.query(Culture).filter(Culture.slug == slug).first()
    if not culture:
        raise HTTPException(404, "Culture not found")

    for k, v in payload.dict(exclude_unset=True, exclude={"gallery"}).items():
        setattr(culture, k, v)

    if payload.gallery is not None:
        db.query(CultureImage).filter(CultureImage.culture_id == culture.id).delete()
        create_images(db, culture, payload.gallery)

    db.commit()
    db.refresh(culture)
    return culture

@router.delete("/{slug}", status_code=204)
def delete_culture(slug: str, db: Session = Depends(get_db)):
    culture = db.query(Culture).filter(Culture.slug == slug).first()
    if not culture:
        raise HTTPException(404, "Culture not found")
    db.delete(culture)
    db.commit()


