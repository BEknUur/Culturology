from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database.session import get_db
from ..models.culture import Culture
from ..utils.ai_chat import ask_culture_bot

router = APIRouter()

@router.post("/{slug}")
def chat_with_culture(
    slug: str,
    question: str,
    db: Session = Depends(get_db),
):
    culture = db.query(Culture).filter(Culture.slug == slug).first()
    if not culture:
        raise HTTPException(404, "Culture not found")

    context = "\n\n".join(
        filter(
            None,
            [culture.about, culture.traditions, culture.lifestyle],
        )
    )
    if not context:
        context = culture.description or f"Information about {culture.name}"

    answer = ask_culture_bot(context=context, question=question)
    return {"answer": answer}
