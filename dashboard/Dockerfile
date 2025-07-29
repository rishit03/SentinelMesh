# dashboard/Dockerfile

FROM python:3.12-slim

WORKDIR /app

COPY dashboard /app
COPY .env /app/.env

RUN pip install streamlit requests python-dotenv pandas

EXPOSE 8501

CMD ["streamlit", "run", "remote_dashboard.py", "--server.port=8501", "--server.address=0.0.0.0"]
