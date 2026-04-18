# ROUTES TASKS 
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.models import Task, User
from app.schemas.schemas import TaskCreate
from app.core.auth import get_current_user

router = APIRouter(prefix="/tasks")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
def create_task(task: TaskCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    # Create the task and manually attach the current user's ID as the owner
    db_task = Task(title=task.title, owner_id=user.id)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@router.get("/")
def get_tasks(
    skip: int = 0,
    limit: int = 5,
    completed: bool | None = None,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    query = db.query(Task).filter(Task.owner_id == user.id)
    if completed is not None:
        query = query.filter(Task.completed == completed)

    tasks = query.offset(skip).limit(limit).all()
    return tasks

@router.get("/{task_id}")
def get_task(
    task_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    task = db.query(Task).filter(
        Task.id == task_id,
        Task.owner_id == user.id
    ).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    return task

@router.put("/{task_id}")
def update_task(task_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    task = db.query(Task).filter(Task.id == task_id, Task.owner_id == user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    task.completed = True
    db.commit()
    return task

@router.delete("/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    task = db.query(Task).filter(Task.id == task_id, Task.owner_id == user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return {"msg": "deleted"}