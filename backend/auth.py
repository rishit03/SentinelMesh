# backend/auth.py

from fastapi import Header, HTTPException, status

# You can later load this from .env or a config file
VALID_TOKENS = {
    "rishit-org-token": "rishit-org",
    "demo-token": "public",
}

def get_current_org(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid auth header")

    token = authorization.split(" ")[1]
    org = VALID_TOKENS.get(token)

    if not org:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    return org
