from sqlmodel import SQLModel, Field
from typing import Optional, List
from datetime import datetime
from pydantic import validator, BaseModel
from sqlalchemy import JSON
from .user import User
import json


class TaskBase(SQLModel):
    title: str = Field(nullable=False)
    description: Optional[str] = None
    completed: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Stored in DB as JSON string
    tags: str = Field(default="[]", sa_column=JSON)

    due_date: Optional[datetime] = None
    priority: str = "medium"
    recurrence: Optional[str] = None


class Task(TaskBase, table=True):
    id: int = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="user.id")  # Filled from JWT only

class TaskRead(BaseModel):
    id: int
    user_id: str
    title: str
    description: Optional[str] = None
    completed: bool
    created_at: datetime
    updated_at: datetime

    # frontend sees a real list
    tags: List[str] = []

    due_date: Optional[datetime]
    priority: str
    recurrence: Optional[str]

    class Config:
        orm_mode = True

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    completed: bool = False
    tags: List[str] = []
    due_date: Optional[datetime] = None
    priority: str = "medium"
    recurrence: Optional[str] = None

    @validator("priority")
    def validate_priority(cls, v):
        if v not in ["low", "medium", "high"]:
            raise ValueError("Priority must be one of: low, medium, high")
        return v

    @validator("recurrence")
    def validate_recurrence(cls, v):
        if v and v not in ["daily", "weekly", "monthly", "yearly"]:
            raise ValueError("Recurrence must be daily, weekly, monthly, yearly")
        return v

    # Convert to DB dictionary
    def to_orm(self, user_id: str):
        return {
            "title": self.title,
            "description": self.description,
            "completed": self.completed,
            "tags": json.dumps(self.tags),
            "due_date": self.due_date,
            "priority": self.priority,
            "recurrence": self.recurrence,
            "user_id": user_id,
        }


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None
    tags: Optional[List[str]] = None
    due_date: Optional[datetime] = None
    priority: Optional[str] = None
    recurrence: Optional[str] = None

    @validator("priority")
    def validate_priority(cls, v):
        if v and v not in ["low", "medium", "high"]:
            raise ValueError("Priority must be low, medium, high")
        return v

    @validator("recurrence")
    def validate_recurrence(cls, v):
        if v and v not in ["daily", "weekly", "monthly", "yearly"]:
            raise ValueError("Recurrence must be daily, weekly, monthly, yearly")
        return v

    def to_update_dict(self):
        update_data = self.dict(exclude_unset=True)
        if "tags" in update_data and update_data["tags"] is not None:
            update_data["tags"] = json.dumps(update_data["tags"])
        return update_data