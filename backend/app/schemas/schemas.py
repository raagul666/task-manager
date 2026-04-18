# SCHEMAS
from pydantic import BaseModel

class UserCreate(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TaskCreate(BaseModel):
    title: str

class TaskOut(BaseModel):
    id: int
    title: str
    completed: bool

    class Config:
        from_attributes = True