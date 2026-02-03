from fastapi import Request, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from typing import Optional
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from functools import lru_cache

load_dotenv()

# JWT Configuration
JWT_SECRET = os.getenv("BETTER_AUTH_SECRET")
if not JWT_SECRET:
    raise ValueError("BETTER_AUTH_SECRET environment variable is not set")

# Performance optimization: cache decoded payloads
@lru_cache(maxsize=128)
def cached_decode(token: str, secret: str) -> dict:
    """
    Cached JWT decoding function for performance optimization.

    Args:
        token (str): JWT token to decode
        secret (str): Secret key for decoding

    Returns:
        dict: Decoded token payload
    """
    return jwt.decode(token, secret, algorithms=["HS512"])


class JWTMeta(BaseModel):
    """JWT metadata model."""
    exp: int
    user_id: str
    email: str


class JWTBearer(HTTPBearer):
    """Custom JWT Bearer authentication scheme."""

    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request):
        credentials: Optional[HTTPAuthorizationCredentials] = await super(
            JWTBearer, self
        ).__call__(request)

        if credentials:
            if not credentials.scheme == "Bearer":
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Invalid authentication scheme."
                )

            token = credentials.credentials

            # Verify token and extract user_id
            user_id = self.verify_jwt(token)

            if not user_id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Invalid token or expired token."
                )

            # Attach user_id to request
            request.state.user_id = user_id
            return token
        else:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Invalid authorization code."
            )

    def verify_jwt(self, token: str) -> Optional[str]:
        """
        Verify JWT token and return user_id if valid.
        Includes performance optimizations and strict validation.

        Args:
            token (str): JWT token to verify

        Returns:
            Optional[str]: user_id if token is valid, None otherwise
        """
        try:
            # Use cached decoding for performance
            payload = cached_decode(token, JWT_SECRET)

            # Validate required claims
            if 'user_id' not in payload or 'email' not in payload or 'exp' not in payload:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Token missing required claims (user_id, email, exp)."
                )

            # Additional validation
            if not isinstance(payload['user_id'], str) or not payload['user_id']:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Invalid user_id in token."
                )

            if not isinstance(payload['email'], str) or '@' not in payload['email']:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Invalid email in token."
                )

            if not isinstance(payload['exp'], int) or payload['exp'] <= 0:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Invalid expiration in token."
                )

            return payload['user_id']

        except jwt.ExpiredSignatureError:
            # Clear cache for expired token
            cached_decode.cache_clear()
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Token has expired."
            )
        except jwt.InvalidSignatureError:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Invalid token signature."
            )
        except jwt.DecodeError:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Malformed token."
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Could not validate credentials: {str(e)}"
            )


# Function to extract user_id from token (for use in dependencies)
def get_current_user_id(request: Request) -> str:
    """
    Get current user_id from request state.

    Args:
        request (Request): FastAPI request object

    Returns:
        str: Current user's ID
    """
    return getattr(request.state, 'user_id', None)