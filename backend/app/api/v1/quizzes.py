from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from sqlalchemy.orm import selectinload
from app.db import get_session
from app.models import Quiz, Question
from app.schemas import QuizRead, QuestionRead, AnswerRequest, AnswerResponse

router = APIRouter(prefix="/quizzes", tags=["quizzes"])

@router.get("/", response_model=List[QuizRead])
def list_quizzes(s: Session = Depends(get_session)):
    return s.exec(select(Quiz).options(selectinload(Quiz.questions))).all()

@router.get("/{qid}", response_model=QuizRead)
def get_quiz(qid: str, s: Session = Depends(get_session)):
    q = s.get(Quiz, qid)
    if not q: raise HTTPException(404)
    return q

@router.post("/{qid}/answer", response_model=AnswerResponse)
def check_answer(qid: str, body: AnswerRequest, s: Session = Depends(get_session)):
    quiz = s.get(Quiz, qid);  _404(quiz)
    correct = [q.correct for q in quiz.questions]
    
    is_ok = body.answers == correct[0]
    return AnswerResponse(correct=is_ok)

def _404(o): 
    if not o: raise HTTPException(404)
