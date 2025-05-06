import os
from dotenv import load_dotenv

import openai
from fastapi import APIRouter, Depends, HTTPException, status, Path
from sqlalchemy.orm import Session

from ..database.session import get_db
from ..models.culture import Culture
from ..schemas.chat import ChatRequest, ChatResponse

# Загружаем переменные из .env
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "../.env"))

# Устанавливаем API-ключ
OPENAI_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_KEY:
    raise RuntimeError("OPENAI_API_KEY not set in environment")
openai.api_key = OPENAI_KEY

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.post(
    "/{slug}",
    response_model=ChatResponse,
    summary="Задать вопрос по конкретной культуре",
)
async def chat_with_culture(
    slug: str = Path(..., description="Slug культуры"),
    payload: ChatRequest = ...,
    db: Session = Depends(get_db),
):
    culture = db.query(Culture).filter(Culture.slug == slug).first()
    if not culture:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Culture not found",
        )

    system_prompt = (
        "You are a knowledgeable assistant about indigenous cultures. "
        f"Current topic: '{culture.name}' culture (region: {culture.region})."
    )
    user_prompt = payload.question

    try:
        resp = await openai.ChatCompletion.acreate(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user",   "content": user_prompt},
            ],
            temperature=0.7,
            max_tokens=500,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"OpenAI API error: {e}"
        )

    answer = resp.choices[0].message.content.strip()
    return ChatResponse(answer=answer)


@router.post(
    "/",
    response_model=ChatResponse,
    summary="Задать общий вопрос по сайту Culturology",
)
async def chat_general(
    payload: ChatRequest,
):
    system_prompt = (
        "You are a helpful assistant for the Culturology website. "
        "Feel free to answer any questions about indigenous cultures, "
        "their traditions, languages, history and how the site works."
    )
    try:
        resp = await openai.ChatCompletion.acreate(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user",   "content": payload.question},
            ],
            temperature=0.7,
            max_tokens=500,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"OpenAI API error: {e}"
        )

    answer = resp.choices[0].message.content.strip()
    return ChatResponse(answer=answer)
