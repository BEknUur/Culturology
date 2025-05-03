from pathlib import Path
from pydantic_settings import BaseSettings
from pydantic import Field

BASE = Path(__file__).resolve().parents[1]
class Settings(BaseSettings):
    database_url: str
    openai_api_key: str | None = None
    clerk_jwks_url: str | None = None
    admin_api_key: str = Field(..., env="ADMIN_API_KEY") 

    class Config:
        env_file = str(BASE / ".env")
        env_file_encoding = "utf-8"

settings = Settings()