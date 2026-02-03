from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
import uuid


class UserBase(SQLModel):
    """Base model for User with common fields."""
    email: str = Field(unique=True, nullable=False)
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = Field(default_factory=datetime.utcnow)


class User(UserBase, table=True):
    """User model for the database."""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)


class UserRead(UserBase):
    """Schema for reading user data."""
    id: str


class UserCreate(UserBase):
    """Schema for creating a new user."""
    pass


class UserUpdate(SQLModel):
    """Schema for updating user data."""
    email: Optional[str] = None
    updated_at: Optional[datetime] = Field(default_factory=datetime.utcnow)