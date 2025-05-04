

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database.session import engine, Base
from .routes import cultures, quiz,  chat

app = FastAPI(
    title="Culturology API",
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
app.include_router(chat.router,     prefix="/api/chat",      tags=["chat"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Culturology API!"}
