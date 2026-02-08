from fastapi import Request, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from typing import Optional
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from functools import lru_cache

load_dotenv()

# ---------------------------------------------
# JWT CONFIGURATION
# ---------------------------------------------

JWT_SECRET = os.getenv("BETTER_AUTH_SECRET")
if not JWT_SECRET:
    raise ValueError("BETTER_AUTH_SECRET environment variable is not set")

# Load algorithm from env or default to HS256
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

# ---------------------------------------------
# CACHED TOKEN DECODER
# ---------------------------------------------
@lru_cache(maxsize=128)
def cached_decode(token: str, secret: str) -> dict:
    """
    Cached JWT decoding function for performance optimization.
    Ensures consistent algorithm usage.
    """
    return jwt.decode(token, secret, algorithms=[JWT_ALGORITHM])


# ---------------------------------------------
# MODELS
# ---------------------------------------------
class JWTMeta(BaseModel):
    exp: int
    user_id: str
    email: str


# ---------------------------------------------
# JWT BEARER CLASS
# ---------------------------------------------
class JWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request):
        credentials: Optional[HTTPAuthorizationCredentials] = await super().__call__(request)

        if credentials:
            if credentials.scheme != "Bearer":
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Invalid authentication scheme."
                )

            token = credentials.credentials

            # Validate token
            user_id = self.verify_jwt(token)

            if not user_id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Invalid or expired token."
                )

            # Attach current user to request
            request.state.user_id = user_id
            return token

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid authorization code."
        )

    # -----------------------------------------
    # TOKEN VERIFICATION
    # -----------------------------------------
    def verify_jwt(self, token: str) -> Optional[str]:
        try:
            payload = cached_decode(token, JWT_SECRET)

            # Validate required claims
            if "user_id" not in payload or "email" not in payload or "exp" not in payload:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Token missing required claims (user_id, email, exp)."
                )

            # Additional validation
            if not isinstance(payload["user_id"], str) or not payload["user_id"]:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Invalid user_id in token."
                )

            if not isinstance(payload["email"], str) or "@" not in payload["email"]:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Invalid email in token."
                )

            return payload["user_id"]

        except jwt.ExpiredSignatureError:
            cached_decode.cache_clear()
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Token has expired.")

        except jwt.InvalidSignatureError:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid token signature.")

        except jwt.DecodeError:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Malformed token.")

        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Could not validate credentials: {str(e)}"
            )


# ---------------------------------------------
# EXTRACT USER ID FROM REQUEST (DEPENDENCY)
# ---------------------------------------------
def get_current_user_id(request: Request) -> Optional[str]:
    """
    Used inside endpoints to get logged-in user's ID.
    """
    return getattr(request.state, "user_id", None)