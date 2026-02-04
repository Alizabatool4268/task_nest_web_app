from sqlmodel import Session, select
from typing import List, Optional
from ..models.task import Task, TaskCreate, TaskUpdate, TaskRead
from ..models.user import User
from fastapi import HTTPException, status
from datetime import datetime
import uuid
import json

from sqlmodel import Session, select
from typing import List, Optional
from ..models.task import Task, TaskCreate, TaskUpdate, TaskRead
from ..models.user import User
from fastapi import HTTPException, status
from datetime import datetime
import json


class TaskService:
    """Service class for handling task operations."""

    @staticmethod
    def create_task(session: Session, task_create: TaskCreate, user_id: str) -> TaskRead:
        """
        Create a new task for a given user.
        """
        # Verify user exists
        user = session.get(User, user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        # Convert tags list to JSON string for DB storage
        task_dict = task_create.dict()
        task_dict["user_id"] = user_id
        task_dict["tags"] = json.dumps(task_dict.get("tags", []))

        # Create task
        task = Task(**task_dict)
        session.add(task)
        session.commit()
        session.refresh(task)

        # Return TaskRead with tags as list
        return TaskRead(
            id=task.id,
            user_id=task.user_id,
            title=task.title,
            description=task.description,
            completed=task.completed,
            created_at=task.created_at,
            updated_at=task.updated_at,
            tags=json.loads(task.tags) if task.tags else [],
            due_date=task.due_date,
            priority=task.priority,
            recurrence=task.recurrence,
        )

    @staticmethod
    def get_tasks_by_user(session: Session, user_id: str) -> List[TaskRead]:
        statement = select(Task).where(Task.user_id == user_id)
        tasks = session.exec(statement).all()
        task_reads = [
            TaskRead(
                id=task.id,
                user_id=task.user_id,
                title=task.title,
                description=task.description,
                completed=task.completed,
                created_at=task.created_at,
                updated_at=task.updated_at,
                tags=json.loads(task.tags) if task.tags else [],
                due_date=task.due_date,
                priority=task.priority,
                recurrence=task.recurrence,
            )
            for task in tasks
        ]
        return task_reads

    @staticmethod
    def get_task_by_id_and_user(session: Session, task_id: int, user_id: str) -> Optional[TaskRead]:
        statement = select(Task).where(Task.id == task_id).where(Task.user_id == user_id)
        task = session.exec(statement).first()
        if not task:
            return None
        return TaskRead(
            id=task.id,
            user_id=task.user_id,
            title=task.title,
            description=task.description,
            completed=task.completed,
            created_at=task.created_at,
            updated_at=task.updated_at,
            tags=json.loads(task.tags) if task.tags else [],
            due_date=task.due_date,
            priority=task.priority,
            recurrence=task.recurrence,
        )

    @staticmethod
    def update_task_by_id_and_user(session: Session, task_id: int, user_id: str, task_update: TaskUpdate) -> Optional[TaskRead]:
        statement = select(Task).where(Task.id == task_id).where(Task.user_id == user_id)
        task = session.exec(statement).first()
        if not task:
            return None

        update_data = task_update.dict(exclude_unset=True)
        if "tags" in update_data:
            update_data["tags"] = json.dumps(update_data["tags"])
        for key, value in update_data.items():
            setattr(task, key, value)

        task.updated_at = datetime.utcnow()
        session.add(task)
        session.commit()
        session.refresh(task)

        return TaskRead(
            id=task.id,
            user_id=task.user_id,
            title=task.title,
            description=task.description,
            completed=task.completed,
            created_at=task.created_at,
            updated_at=task.updated_at,
            tags=json.loads(task.tags) if task.tags else [],
            due_date=task.due_date,
            priority=task.priority,
            recurrence=task.recurrence,
        )

    @staticmethod
    def delete_task_by_id_and_user(session: Session, task_id: int, user_id: str) -> bool:
        statement = select(Task).where(Task.id == task_id).where(Task.user_id == user_id)
        task = session.exec(statement).first()
        if not task:
            return False
        session.delete(task)
        session.commit()
        return True