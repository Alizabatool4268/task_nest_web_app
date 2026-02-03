from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from ....database import get_session
from ....models.task import Task, TaskCreate, TaskRead, TaskUpdate
from ....services.task_service import TaskService
from ....middleware.jwt_middleware import JWTBearer, get_current_user_id

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.post("/", response_model=TaskRead)
async def create_task(
    task_create: TaskCreate,
    token: str = Depends(JWTBearer()),
    session: Session = Depends(get_session)
):
    """
    Create a new task for the authenticated user.

    Args:
        task_create (TaskCreate): Task creation data
        token (str): JWT token (automatically validated)
        session (Session): Database session

    Returns:
        TaskRead: Created task
    """
    # Get current user ID from token (attached by middleware)
    user_id = get_current_user_id(token)

    # Ensure the task is being created for the authenticated user
    if task_create.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot create task for another user"
        )

    # Create the task
    task = TaskService.create_task(session, task_create)

    return task


@router.get("/", response_model=list[TaskRead])
async def get_tasks(
    token: str = Depends(JWTBearer()),
    session: Session = Depends(get_session)
):
    """
    Get all tasks for the authenticated user.

    Args:
        token (str): JWT token (automatically validated)
        session (Session): Database session

    Returns:
        List[TaskRead]: List of tasks for the authenticated user
    """
    # Get current user ID from token (attached by middleware)
    user_id = get_current_user_id(token)

    # Get tasks for this user
    tasks = TaskService.get_tasks_by_user(session, user_id)

    return tasks


@router.get("/{task_id}", response_model=TaskRead)
async def get_task(
    task_id: int,
    token: str = Depends(JWTBearer()),
    session: Session = Depends(get_session)
):
    """
    Get a specific task by ID for the authenticated user.

    Args:
        task_id (int): Task ID
        token (str): JWT token (automatically validated)
        session (Session): Database session

    Returns:
        TaskRead: The requested task
    """
    # Get current user ID from token (attached by middleware)
    user_id = get_current_user_id(token)

    # Get the task for this user
    task = TaskService.get_task_by_id_and_user(session, task_id, user_id)

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
    token: str = Depends(JWTBearer()),
    session: Session = Depends(get_session)
):
    """
    Update a specific task by ID for the authenticated user.

    Args:
        task_id (int): Task ID
        task_update (TaskUpdate): Task update data
        token (str): JWT token (automatically validated)
        session (Session): Database session

    Returns:
        TaskRead: Updated task
    """
    # Get current user ID from token (attached by middleware)
    user_id = get_current_user_id(token)

    # Update the task for this user
    updated_task = TaskService.update_task_by_id_and_user(session, task_id, user_id, task_update)

    if not updated_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found or does not belong to user"
        )

    return updated_task


@router.delete("/{task_id}")
async def delete_task(
    task_id: int,
    token: str = Depends(JWTBearer()),
    session: Session = Depends(get_session)
):
    """
    Delete a specific task by ID for the authenticated user.

    Args:
        task_id (int): Task ID
        token (str): JWT token (automatically validated)
        session (Session): Database session

    Returns:
        dict: Success message
    """
    # Get current user ID from token (attached by middleware)
    user_id = get_current_user_id(token)

    # Delete the task for this user
    deleted = TaskService.delete_task_by_id_and_user(session, task_id, user_id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found or does not belong to user"
        )

    return {"message": "Task deleted successfully"}


@router.patch("/{task_id}/complete")
async def complete_task(
    task_id: int,
    completed: bool,
    token: str = Depends(JWTBearer()),
    session: Session = Depends(get_session)
):
    """
    Mark a specific task as completed/incompleted for the authenticated user.

    Args:
        task_id (int): Task ID
        completed (bool): Completion status
        token (str): JWT token (automatically validated)
        session (Session): Database session

    Returns:
        TaskRead: Updated task
    """
    # Get current user ID from token (attached by middleware)
    user_id = get_current_user_id(token)

    # Update task completion status for this user
    updated_task = TaskService.complete_task_by_id_and_user(session, task_id, user_id, completed)

    if not updated_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found or does not belong to user"
        )

    return updated_task