from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import auth, tasks
from app.db.database import Base, engine

app = FastAPI()

# CORS 
# This allows your frontend to make requests to the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
Base.metadata.create_all(bind=engine)

# INCLUDE ROUTES (THIS IS THE MAIN FIX)
app.include_router(auth.router)
app.include_router(tasks.router)