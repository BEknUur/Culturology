from fastapi import FastAPI
from app.api.v1 import people, cultures
from app.api.v1 import people, cultures, admin, map as map_api, quizzes, chat
app = FastAPI(title="Culturology API")

app.include_router(people.router, prefix="/api/v1")
app.include_router(cultures.router, prefix="/api/v1")

app.include_router(admin.router, prefix="/api/v1")
app.include_router(map_api.router, prefix="/api/v1")
app.include_router(quizzes.router, prefix="/api/v1")
app.include_router(chat.router, prefix="/api/v1")


@app.get("/ping")
async def ping():
    return {"status": "ok"}