from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database.session import get_db
from ..models.culture import Culture
from ..schemas.map import CulturePoint

router = APIRouter()

@router.get("/", response_model=list[CulturePoint])
def get_culture_points(db: Session = Depends(get_db)):
    # отдаём только те, у кого заданы координаты
    cultures = (
        db.query(Culture)
        .filter(Culture.latitude.isnot(None), Culture.longitude.isnot(None))
        .all()
    )
    return [
        CulturePoint(
            slug=c.slug,
            name=c.name,
            lat=c.latitude,
            lng=c.longitude,
        )
        for c in cultures
    ]
