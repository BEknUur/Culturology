from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database.session import get_db
from ..models.quiz import Quiz
from ..models.culture import Culture
from ..schemas.quiz import QuizCreate, QuizUpdate, QuizOut

router = APIRouter()

# CREATE --------------------------------------------------------
@router.post("/", response_model=QuizOut, status_code=status.HTTP_201_CREATED)
def create_quiz(payload: QuizCreate, db: Session = Depends(get_db)):
    # проверяем, что culture существует
    if not db.get(Culture, payload.culture_id):
        raise HTTPException(404, "Culture not found")

    quiz = Quiz(**payload.dict())
    db.add(quiz)
    db.commit()
    db.refresh(quiz)
    return quiz

# LIST ---------------------------------------------------------
@router.get("/", response_model=list[QuizOut])
def list_quizzes(
    culture_id: int | None = None,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
):
    q = db.query(Quiz)
    if culture_id:
        q = q.filter(Quiz.culture_id == culture_id)
    return q.offset(skip).limit(limit).all()

# RETRIEVE -----------------------------------------------------
@router.get("/{quiz_id}", response_model=QuizOut)
def get_quiz(quiz_id: int, db: Session = Depends(get_db)):
    quiz = db.get(Quiz, quiz_id)
    if not quiz:
        raise HTTPException(404, "Quiz not found")
    return quiz

# UPDATE -------------------------------------------------------
@router.put("/{quiz_id}", response_model=QuizOut)
def update_quiz(
    quiz_id: int,
    payload: QuizUpdate,
    db: Session = Depends(get_db),
):
    quiz = db.get(Quiz, quiz_id)
    if not quiz:
        raise HTTPException(404, "Quiz not found")

    for k, v in payload.dict(exclude_unset=True).items():
        setattr(quiz, k, v)
    db.commit()
    db.refresh(quiz)
    return quiz

# DELETE -------------------------------------------------------
@router.delete("/{quiz_id}", status_code=204)
def delete_quiz(quiz_id: int, db: Session = Depends(get_db)):
    quiz = db.get(Quiz, quiz_id)
    if not quiz:
        raise HTTPException(404, "Quiz not found")
    db.delete(quiz)
    db.commit()
