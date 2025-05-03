import httpx, os
from fastapi import APIRouter, Depends, HTTPException
from app.db import get_session
from sqlmodel import Session
from app.models import People
from app.core.settings import settings

router = APIRouter(prefix="/chat", tags=["chat"])

@router.post("/{people_id}")
async def ask_people(people_id: str, question: str, s: Session = Depends(get_session)):
    person = s.get(People, people_id)
    if not person: raise HTTPException(404, "People not found")

    if not settings.openai_api_key:
        raise HTTPException(500, "OpenAI key not set")

    prompt = f"You are a representative of {person.name}. {question}"
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            "https://api.openai.com/v1/chat/completions",
            headers={"Authorization": f"Bearer {settings.openai_api_key}"},
            json={
                "model": "gpt-3.5-turbo",
                "messages": [{"role": "user", "content": prompt}],
            },
            timeout=60,
        )
    resp.raise_for_status()
    answer = resp.json()["choices"][0]["message"]["content"]
    return {"answer": answer}
