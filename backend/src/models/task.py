from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
import uuid


class TaskBase(SQLModel):
    """Base model for Task with common fields."""
    title: str = Field(nullable=False)
    description: Optional[str] = Field(default=None)
    completed: bool = Field(default=False)
    priority: str = Field(default="medium")  # low, medium, high
    tags: Optional[str] = Field(default=None)  # JSON string
    due_date: Optional[datetime] = Field(default=None)
    recurring: bool = Field(default=False)
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = Field(default_factory=datetime.utcnow)


class Task(TaskBase, table=True):
    """Task model for the database."""
    id: int = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="user.id")


class TaskRead(TaskBase):
    """Schema for reading task data."""
    id: int
    user_id: str


class TaskCreate(TaskBase):
    """Schema for creating a new task."""
    title: str
    user_id: str


class TaskUpdate(SQLModel):
    """Schema for updating task data."""
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None
    priority: Optional[str] = None
    tags: Optional[str] = None
    due_date: Optional[datetime] = None
    recurring: Optional[bool] = None
    updated_at: Optional[datetime] = Field(default_factory=datetime.utcnow)