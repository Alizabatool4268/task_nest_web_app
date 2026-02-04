from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import Dict
from src.database import get_session
from src.models.user import UserCreate, User
from src.services.auth_service import AuthService
from src.utils.jwt import verify_token
from jose import JWTError
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Security


router = APIRouter(prefix="/auth", tags=["auth"])
security_scheme = HTTPBearer()


# ------------------------
# Signup Endpoint
# ------------------------
@router.post("/signup", response_model=Dict[str, str])
def signup(user_create: UserCreate, db: Session = Depends(get_session)):
    """
    Register a new user and return JWT token.
    """
    auth_service = AuthService()
    try:
        user = auth_service.create_user(db, user_create)
        access_token = auth_service.create_access_token_for_user(user)
        return {"access_token": access_token, "token_type": "bearer"}
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


# ------------------------
# Login Model
# ------------------------
from pydantic import BaseModel

class UserLogin(BaseModel):
    email: str
    password: str


# ------------------------
# Login Endpoint
# ------------------------
@router.post("/login", response_model=Dict[str, str])
def login(login_data: UserLogin, db: Session = Depends(get_session)):
    """
    Authenticate user using JSON body and return access token.
    """
    auth_service = AuthService()
    user = auth_service.authenticate_user(db, login_data.email, login_data.password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = auth_service.create_access_token_for_user(user)
    return {"access_token": access_token, "token_type": "bearer"}


# ------------------------
# Current User Dependency
# ------------------------
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    db: Session = Depends(get_session)
) -> User:
    """
    Get current user from JWT token.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    token = credentials.credentials
    try:
        payload = verify_token(token)
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    auth_service = AuthService()
    user = auth_service.get_user_by_id(db, user_id)
    if user is None:
        raise credentials_exception

    return user


# ------------------------
# Get Current User Endpoint
# ------------------------
from fastapi import Security

@router.get(
    "/me",
    response_model=User,
    summary="Get current user",
    description="Return the currently logged-in user based on JWT token",
)
def get_current_user_endpoint(
    current_user: User = Security(get_current_user)
):
    return current_user