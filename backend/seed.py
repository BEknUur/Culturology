import json
from pathlib import Path
from sqlmodel import Session, SQLModel
from app.db import engine
from app.models import People

DATA = Path(__file__).with_name("seed_peoples.json")
SQLModel.metadata.create_all(engine)

def run():
    with Session(engine) as s:
        for rec in json.loads(DATA.read_text()):
            if not s.get(People, rec["id"]):
                s.add(People(**rec))
        s.commit()

if __name__ == "__main__":
    run()
    print("Seed complete")