from sqlmodel import create_engine, Session
from app.core.settings import settings

engine = create_engine(settings.database_url, pool_pre_ping=True, echo=False)

def get_session():
    with Session(engine) as s:
        yield s