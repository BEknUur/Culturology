from fastapi import FastAPI
from .routes import cultures, quiz, map, chat
from .database.session import engine, Base        # Base теперь подгружаем отсюда

app = FastAPI()

app.include_router(cultures.router, prefix="/api/cultures", tags=["cultures"])
app.include_router(quiz.router,     prefix="/api/quiz",     tags=["quiz"])
app.include_router(map.router,      prefix="/api/map",      tags=["map"])
app.include_router(chat.router,     prefix="/api/chat",     tags=["chat"])

# создаём таблицы ОДИН раз, после того как все модели импортированы
Base.metadata.create_all(bind=engine)

@app.get("/")
def read_root():
    return {"message": "Welcome to Culturology API!"}
