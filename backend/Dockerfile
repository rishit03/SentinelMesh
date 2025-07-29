# backend/Dockerfile

FROM python:3.12-slim

WORKDIR /app

COPY backend /app
COPY logs /app/logs
COPY .env /app/.env

RUN pip install fastapi uvicorn aiosqlite python-dotenv

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
