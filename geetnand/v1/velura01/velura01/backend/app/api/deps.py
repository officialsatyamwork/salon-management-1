import uuid
from typing import Annotated

import jwt
from fastapi import Depends, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.errors import Unauthorized
from app.core.security import decode_access_token
from app.db.session import get_db
from app.models import User

DB = Annotated[AsyncSession, Depends(get_db)]

_bearer = HTTPBearer(auto_error=False)


async def get_current_user(db: DB, creds: Annotated[HTTPAuthorizationCredentials | None, Depends(_bearer)]) -> User:
    if creds is None or creds.scheme.lower() != "bearer":
        raise Unauthorized("Not signed in", code="not_authenticated")
    try:
        payload = decode_access_token(creds.credentials)
        user_id = uuid.UUID(payload["sub"])
    except jwt.ExpiredSignatureError:
        raise Unauthorized("Session expired", code="token_expired") from None
    except (jwt.InvalidTokenError, ValueError, KeyError):
        raise Unauthorized("Invalid session", code="invalid_token") from None

    user = await db.get(User, user_id)
    # token_version lets us invalidate every outstanding access token at once
    # (password change, deactivation) without a token blocklist.
    if user is None or not user.is_active or payload.get("tv") != user.token_version:
        raise Unauthorized("Session is no longer valid", code="invalid_token")
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]


def client_ip(request: Request) -> str | None:
    # Uvicorn runs with --proxy-headers behind the reverse proxy, so this is the real client.
    return request.client.host if request.client else None
