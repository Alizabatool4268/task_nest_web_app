from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from src.database import get_session
from src.models.task import TaskCreate, TaskRead, TaskUpdate
from src.services.task_service import TaskService
from src.api.v1.endpoints.auth import get_current_user
from src.models.user import User


router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.post("/", response_model=TaskRead)
async def create_task(
    task_create: TaskCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Create a new task for the authenticated user.
    """
    task_service = TaskService()
    task = task_service.create_task(session=session, task_create=task_create, user_id=current_user.id)

    return task



@router.get("/", response_model=list[TaskRead])
async def get_tasks(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Get all tasks for the authenticated user.
    """
    task_service = TaskService()
    tasks = task_service.get_tasks_by_user(session, current_user.id)
    return tasks


@router.get("/{task_id}", response_model=TaskRead)
async def get_task(
    task_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Get a single task owned by the authenticated user.
    """
    task_service = TaskService()
    task = task_service.get_task_by_id_and_user(session, task_id, current_user.id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found or does not belong to user"
        )

    return task


@router.put("/{task_id}", response_model=TaskRead)
async def update_task(
    task_id: int,
    task_update: TaskUpdate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Update a task only if it belongs to the authenticated user.
    """
    task_service = TaskService()
    updated_task = task_service.update_task_by_id_and_user(
        session, task_id, current_user.id, task_update
    )

    if not updated_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found or does not belong to user"
        )

    return updated_task


@router.delete("/{task_id}")
async def delete_task(
    task_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Delete a task only if it belongs to the authenticated user.
    """
    task_service = TaskService()
    deleted = task_service.delete_task_by_id_and_user(
        session, task_id, current_user.id
    )

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found or does not belong to user"
        )

    return {"message": "Task deleted successfully"}