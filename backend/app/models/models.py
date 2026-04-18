# MODELS
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from app.db.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String) 
    completed = Column(Boolean, default=False) # Tasks are defaulted to incomplete when first created
    owner_id = Column(Integer, ForeignKey("users.id")) # Links each task to a specific user so users can't see each other's tasks