import os
import json
import random
from dotenv import load_dotenv
import openai
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from ..database.session import get_db
from ..models.culture import Culture
from ..models.quiz import Quiz
from ..schemas.quiz import QuizCreate, QuizUpdate, QuizOut, QuizItem
load_dotenv()
OPENAI_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_KEY:
    raise RuntimeError("OPENAI_API_KEY not set in .env")
openai.api_key = OPENAI_KEY


router = APIRouter(prefix="/api/quiz", tags=["quiz"])

STATIC_TEMPLATES = [
    ("What region is the {name} culture from?", "region"),
    ("What is the primary language of the {name} people?", "language"),
    ("Which country or territory do the {name} traditionally inhabit?", "location"),
    ("Name one of the key traditions of the {name}.", "traditions"),
    ("Describe the typical lifestyle of the {name} people.", "lifestyle"),
]

@router.get("/", response_model=list[QuizOut])
def read_quizzes(
    culture_id: int | None = Query(None, alias="culture_id", description="Filter by culture ID"),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1),
    db: Session = Depends(get_db),
):
   
    q = db.query(Quiz)
    if culture_id is not None:
        q = q.filter(Quiz.culture_id == culture_id)
    return q.offset(skip).limit(limit).all()

@router.post("/", response_model=QuizOut, status_code=status.HTTP_201_CREATED)
def create_quiz(
    payload: QuizCreate,
    db: Session = Depends(get_db),
):
    quiz = Quiz(**payload.dict())
    db.add(quiz)
    db.commit()
    db.refresh(quiz)
    return quiz

@router.put("/{quiz_id}", response_model=QuizOut)
def update_quiz(
    quiz_id: int,
    payload: QuizUpdate,
    db: Session = Depends(get_db),
):
    quiz = db.query(Quiz).get(quiz_id)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    for field, val in payload.dict(exclude_unset=True).items():
        setattr(quiz, field, val)
    db.commit()
    db.refresh(quiz)
    return quiz

@router.delete("/{quiz_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_quiz(
    quiz_id: int,
    db: Session = Depends(get_db),
):
    quiz = db.query(Quiz).get(quiz_id)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    db.delete(quiz)
    db.commit()

@router.post("/generate/{slug}", response_model=list[QuizItem])
async def generate_quiz(
    slug: str,
    db: Session = Depends(get_db),
):
   
    culture = db.query(Culture).filter(Culture.slug == slug).first()
    if not culture:
        raise HTTPException(status_code=404, detail="Culture not found")

    prompt_text = (
        f"Generate 5 multiple choice questions (4 options each) based on:\n"
        f"Name: {culture.name}\n"
        f"Region: {culture.region or ''}\n"
        f"Location: {culture.location or ''}\n"
        f"Population: {culture.population or ''}\n"
        f"Language: {culture.language or ''}\n"
        f"About: {culture.about or ''}\n"
        f"Traditions: {culture.traditions or ''}\n"
        f"Lifestyle: {culture.lifestyle or ''}\n"
        "Return JSON: { \"questions\": [ { \"id\":1, \"question\":\"...\", \"options\":{A:\"..\",B:\"..\",C:\"..\",D:\"..\"}, \"correct\":\"A\" }, ... ] }"
    )

    try:
        resp = await openai.ChatCompletion.acreate(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful quiz generator."},
                {"role": "user", "content": prompt_text},
            ],
            temperature=0.7,
            max_tokens=800,
        )
        text = resp.choices[0].message.content.strip()
        payload = json.loads(text)
        return payload.get("questions", [])
    except Exception as e:
        print("Quiz generation failed, fallback to static:", e)

    
    items: list[QuizItem] = []
    sample = random.sample(STATIC_TEMPLATES, k=5)
    for idx, (tpl, field) in enumerate(sample, start=1):
        q = tpl.format(name=culture.name)
        a = getattr(culture, field) or ""
        items.append(QuizItem(id=idx, question=q, answer=a))
    return items
