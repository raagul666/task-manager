# Task Manager Web Application

## Project Overview
-This is a simple full-stack Task Manager application built using FastAPI and React.

-It allows users to register, login, and manage their personal tasks securely using JWT authentication.

-The goal of this project is to demonstrate backend API development, authentication, database integration, and frontend interaction in a clean and simple way.

---
##  Features

### Authentication
- User Registration
- User Login
- JWT-based authentication
- Password hashing using bcrypt

### Task Management
- Create task
- View all tasks
- View single task
- Mark task as completed
- Delete task
- User-specific tasks (no access to others)

### Additional Features
- Task filtering (`completed / pending`)
- Pagination
- Responsive UI

---
##  Tech Stack
- Backend: FastAPI
- Database: SQLite
- ORM: SQLAlchemy
- Frontend: React (with Axios)
- Authentication: JWT

---
##  Project Structure

task-manager/
├── backend/
│   ├── app/
│   │   ├── core/          # Auth logic and app configuration
│   │   ├── db/            # Database connection & session setup
│   │   ├── models/        # SQLAlchemy database models
│   │   ├── routes/        # API endpoints (Auth, Tasks)
│   │   ├── schemas/       # Pydantic data validation models
│   │   └── main.py        # App entry point
│   ├── requirements.txt   # Backend dependencies
│   ├── test_main.py       # API testing suite
│   └── test.db            # SQLite database file
├── frontend/              # Legacy Vanilla JS frontend
│   └── index.html
├── frontend-react/        # Modern React frontend
│   ├── src/
│   └── package.json
├── .env                   # Environment secrets
├── Dockerfile             # Container configuration
└── README.md

---
## Environment Variables
Create a .env file in the root or backend folder:

### For local SQLite development
DATABASE_URL=your_database_url

### SECURITY CONFIG: Change this to a long random string for production
SECRET_KEY=your_secret_key_here

### The algorithm used to sign the JWT tokens
ALGORITHM=algorithm_jwt_tokens

### How long the user stays logged in before needing to re-login (in minutes)
ACCESS_TOKEN_EXPIRE_MINUTES=token_expire_time

---
## How to Run Locally

### Backend Setup
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
API URL: http://127.0.0.1:8000
Interactive Docs: http://127.0.0.1:8000/docs

### Frontend Setup
cd frontend-react
npm install
npm start
App URL: http://localhost:3000

---
### Docker Setup
Run the backend in a isolated container:
docker build -t task-manager .
docker run -p 8000:8000 task-manager

---
### Deployment
Backend: Deployed on Render
Frontend: Deployed on Vercel
Live Demo: [INSERT_YOUR_LINK_HERE]

---
##  Notes
Secrets are stored using environment variables
Each user can access only their own tasks
Designed to be simple and functional

BY
Raagul N