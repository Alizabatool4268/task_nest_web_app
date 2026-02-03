from sqlmodel import Session, select
from typing import List, Optional
from ..models.task import Task, TaskCreate, TaskUpdate
from ..models.user import User
from fastapi import HTTPException, status
from datetime import datetime
import uuid


class TaskService:
    """Service class for handling task operations."""

    @staticmethod
    def create_task(session: Session, task_create: TaskCreate) -> Task:
        """
        Create a new task.

        Args:
            session (Session): Database session
            task_create (TaskCreate): Task creation data

        Returns:
            Task: Created task
        """
        # Verify user exists
        user = session.get(User, task_create.user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        # Create task instance
        task_dict = task_create.dict()
        task = Task(**task_dict)

        # Add to session and commit
        session.add(task)
        session.commit()
        session.refresh(task)

        return task

    @staticmethod
    def get_tasks_by_user(session: Session, user_id: str) -> List[Task]:
        """
        Get all tasks for a specific user.

        Args:
            session (Session): Database session
            user_id (str): User ID

        Returns:
            List[Task]: List of tasks for the user
        """
        # Verify user exists
        user = session.get(User, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        # Query tasks for this user
        statement = select(Task).where(Task.user_id == user_id)
        tasks = session.exec(statement).all()

        return tasks

    @staticmethod
    def get_task_by_id_and_user(session: Session, task_id: int, user_id: str) -> Optional[Task]:
        """
        Get a specific task by ID and user ID.

        Args:
            session (Session): Database session
            task_id (int): Task ID
            user_id (str): User ID

        Returns:
            Optional[Task]: Task if found and belongs to user, None otherwise
        """
        # Verify user exists
        user = session.get(User, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        # Query task for this user
        statement = select(Task).where(Task.id == task_id).where(Task.user_id == user_id)
        task = session.exec(statement).first()

        return task

    @staticmethod
    def update_task_by_id_and_user(session: Session, task_id: int, user_id: str, task_update: TaskUpdate) -> Optional[Task]:
        """
        Update a specific task by ID and user ID.

        Args:
            session (Session): Database session
            task_id (int): Task ID
            user_id (str): User ID
            task_update (TaskUpdate): Update data

        Returns:
            Optional[Task]: Updated task if found and belongs to user, None otherwise
        """
        # Verify user exists
        user = session.get(User, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        # Get the task that belongs to this user
        statement = select(Task).where(Task.id == task_id).where(Task.user_id == user_id)
        task = session.exec(statement).first()

        if not task:
            return None

        # Update the task with provided data
        for key, value in task_update.dict(exclude_unset=True).items():
            setattr(task, key, value)

        session.add(task)
        session.commit()
        session.refresh(task)

        return task

    @staticmethod
    def delete_task_by_id_and_user(session: Session, task_id: int, user_id: str) -> bool:
        """
        Delete a specific task by ID and user ID.

        Args:
            session (Session): Database session
            task_id (int): Task ID
            user_id (str): User ID

        Returns:
            bool: True if task was deleted, False if not found
        """
        # Verify user exists
        user = session.get(User, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        # Get the task that belongs to this user
        statement = select(Task).where(Task.id == task_id).where(Task.user_id == user_id)
        task = session.exec(statement).first()

        if not task:
            return False

        session.delete(task)
        session.commit()

        return True

    @staticmethod
    def complete_task_by_id_and_user(session: Session, task_id: int, user_id: str, completed: bool) -> Optional[Task]:
        """
        Mark a specific task as completed/incompleted by ID and user ID.

        Args:
            session (Session): Database session
            task_id (int): Task ID
            user_id (str): User ID
            completed (bool): Completion status

        Returns:
            Optional[Task]: Updated task if found and belongs to user, None otherwise
        """
        # Verify user exists
        user = session.get(User, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        # Get the task that belongs to this user
        statement = select(Task).where(Task.id == task_id).where(Task.user_id == user_id)
        task = session.exec(statement).first()

        if not task:
            return None

        # Update the completion status
        task.completed = completed
        task.updated_at = datetime.now()

        session.add(task)
        session.commit()
        session.refresh(task)

        return task