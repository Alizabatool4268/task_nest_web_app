from pydantic import BaseModel
from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
import uuid


class UserBase(SQLModel):
    """Base model for User with common fields."""
    name: str = Field(nullable=False)
    email: str = Field(unique=True, nullable=False)


class User(UserBase, table=True):
    """User model for the database."""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    password_hash: str = Field(nullable=False)
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = Field(default_factory=datetime.utcnow)


class UserRead(UserBase):
    """Schema for reading user data."""
    id: str
    created_at: Optional[datetime]


class UserCreate(UserBase):
    """Schema for creating a new user."""
    password: str


class UserUpdate(SQLModel):
    """Schema for updating user data."""
    name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    updated_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    

    class UserLogin(BaseModel):
        email: str
        password: str