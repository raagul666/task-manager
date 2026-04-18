FROM python:3.11

# All subsequent commands happen in this directory
WORKDIR /app  

# Pull in the backend code and install requirements
COPY ./backend /app

RUN pip install --no-cache-dir -r requirements.txt

# Start the server on port 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]