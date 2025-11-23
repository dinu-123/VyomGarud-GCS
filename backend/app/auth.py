# auth.py
import os
import time
from typing import Optional
import jwt
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

# secret for demo — in prod store in env/secret manager
SECRET = os.environ.get("VG_SECRET", "replace_this_secret_for_prod")
ALGORITHM = "HS256"
TOKEN_TTL = 60 * 60 * 24  # 24h

security = HTTPBearer()


def create_token(subject: str) -> str:
    payload = {"sub": subject, "iat": int(time.time()), "exp": int(time.time()) + TOKEN_TTL}
    return jwt.encode(payload, SECRET, algorithm=ALGORITHM)


def decode_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, SECRET, algorithms=[ALGORITHM])
        return payload
    except Exception:
        return None


def get_current_user(creds: HTTPAuthorizationCredentials = Security(security)) -> dict:
    token = creds.credentials
    payload = decode_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return {"user": payload["sub"]}
