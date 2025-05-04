# backend/app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes import cultures, quiz, map, chat
from .database.session import engine, Base

app = FastAPI(title="Culturology API")


origins = [
    "http://localhost:5173",
   
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(cultures.router, prefix="/api/cultures", tags=["cultures"])
app.include_router(quiz.router,     prefix="/api/quiz",     tags=["quiz"])
app.include_router(map.router,      prefix="/api/map",      tags=["map"])
app.include_router(chat.router,     prefix="/api/chat",     tags=["chat"])


Base.metadata.create_all(bind=engine)


@app.get("/", tags=["default"])
def read_root():
    return {"message": "Welcome to Culturology API!"}
