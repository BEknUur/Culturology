from functools import lru_cache
from typing import Dict
from fastapi import Depends, HTTPException, Header
from jose import jwt
import httpx
from app.core.settings import settings

ALGORITHMS = ["RS256"]

@lru_cache
def _get_jwks() -> Dict:
    if not settings.clerk_jwks_url:
        raise RuntimeError("CLERK_JWKS_URL not set")
    resp = httpx.get(settings.clerk_jwks_url, timeout=5)
    resp.raise_for_status()
    return resp.json()


from fastapi import Header, HTTPException
from app.core.settings import settings

def require_admin(x_api_key: str | None = Header(None, alias="X-Api-Key")):
    if x_api_key != settings.admin_api_key:
        raise HTTPException(401, "Invalid or missing X-Api-Key")
    
    return {"is_admin": True}
