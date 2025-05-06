from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database.session import engine, Base
from .routes import cultures, quiz, chat,media
from dotenv import load_dotenv
import os


load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "../.env"))

app = FastAPI(
    title="Culturology API",
    version="0.1.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)


origins = [
    "http://localhost:5173",
    
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       
    allow_credentials=True,
    allow_methods=["*"],          
    allow_headers=["*"],          
)


Base.metadata.create_all(bind=engine)

app.include_router(cultures.router, prefix="/api/cultures", tags=["cultures"])
app.include_router(quiz.router)
app.include_router(chat.router)
app.include_router(media.router) 

