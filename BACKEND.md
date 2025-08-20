# SentinelMesh Dashboard: Backend Architecture

This document details the architecture and key components of the SentinelMesh Dashboard backend, built with FastAPI. The backend is designed for high performance, modularity, and ease of development, leveraging Python's type hints and modern asynchronous capabilities.

## 1. Technology Stack

*   **FastAPI**: A modern, fast (high-performance) web framework for building APIs with Python 3.7+ based on standard Python type hints.
*   **Uvicorn**: An ASGI server for running FastAPI applications.
*   **Pydantic**: Used for data validation, serialization, and settings management.
*   **Passlib**: Provides secure password hashing utilities.
*   **PyJWT**: For encoding and decoding JSON Web Tokens (JWTs).
*   **SQLite**: A lightweight, file-based SQL database for data storage (for demonstration purposes).
*   **WebSockets**: For real-time, bidirectional communication with the frontend.

## 2. Core Architectural Principles

### 2.1. Modular Routers

The API is organized into feature-specific `APIRouter` instances. Each router handles a distinct set of related endpoints, improving code organization and maintainability. This allows for clear separation of concerns and easier scaling.

### 2.2. Dependency Injection

FastAPI's powerful dependency injection system is used extensively to manage shared logic, such as authentication, database sessions, and common utilities. This promotes loose coupling and testability.

### 2.3. Pydantic Models

All request and response data are defined using Pydantic models. This provides automatic data validation, serialization, and clear documentation (via OpenAPI schema generation).

### 2.4. Asynchronous Operations

FastAPI is built on ASGI, allowing for asynchronous operations (`async`/`await`). This enables the backend to handle a large number of concurrent connections efficiently, especially important for real-time features like WebSockets.

## 3. Directory Structure

The backend source code (`backend/`) is organized as follows:

```
backend/
├── main.py             # Main FastAPI application, includes and mounts routers
├── models.py           # Pydantic models for data validation and serialization
├── sqlite.py           # Database connection and session management
├── storage.py          # Data access layer for interacting with the database
├── auth.py             # Utility functions for authentication (hashing, JWT, user lookup)
├── rules/              # Rule engine for risk assessment
│   └── rule_engine.py  # Logic for applying rules to log data
├── routers/            # FastAPI APIRouter modules
│   ├── auth.py         # Endpoints for user registration, login, and token generation
│   ├── logs.py         # Endpoints for log ingestion, retrieval, alerts, and WebSocket
│   └── stats.py        # Endpoints for aggregated dashboard statistics
├── Dockerfile          # Docker configuration for containerization
├── requirements.txt    # Python dependencies
└── pyproject.toml      # Project configuration (e.g., for Poetry/Rye)
```

## 4. Key Modules and Their Roles

### 4.1. `main.py`

This is the entry point for the FastAPI application. Its primary responsibilities include:

*   **Application Initialization**: Creates the FastAPI application instance.
*   **CORS Configuration**: Sets up Cross-Origin Resource Sharing to allow frontend access.
*   **Router Inclusion**: Imports and includes all feature-specific `APIRouter` instances (from the `routers/` directory) into the main application.
*   **Database Initialization**: Ensures the database tables are created on startup.

### 4.2. `models.py`

Defines Pydantic models used throughout the application for data validation and serialization. This includes:

*   **`User`, `UserInDB`**: Models for user data and database representation.
*   **`Token`, `TokenData`**: Models for JWT authentication.
*   **`LogEntry`, `LogResponse`**: Models for incoming log data and outgoing log responses.
*   **`AgentStats`**: Model for aggregated agent statistics.

### 4.3. `sqlite.py`

Handles the SQLite database connection and session management. It provides:

*   **`engine`**: The SQLAlchemy engine for connecting to the database.
*   **`SessionLocal`**: A sessionmaker for creating database sessions.
*   **`Base`**: The declarative base for SQLAlchemy models.
*   **`get_db`**: A dependency function for providing a database session to API endpoints.

### 4.4. `storage.py`

(If implemented as a separate layer) This module would contain the CRUD (Create, Read, Update, Delete) operations for interacting with the database. It abstracts away the direct database queries from the business logic, making it easier to switch databases or test components in isolation.

### 4.5. `auth.py`

Contains utility functions and dependencies related to authentication and authorization:

*   **Password Hashing**: Functions for hashing and verifying passwords (`get_password_hash`, `verify_password`).
*   **JWT Handling**: Functions for creating and decoding access tokens (`create_access_token`, `decode_access_token`).
*   **Authentication Dependencies**: FastAPI dependencies (`authenticate_user`, `get_current_user`, `get_current_org`) to protect API routes and extract user information from tokens.

### 4.6. `rules/rule_engine.py`

Implements the business logic for assessing the risk of incoming log entries. It contains rules that analyze log content, sender, context, and other attributes to assign a risk score. This module is designed to be easily extensible for adding new risk assessment rules.

### 4.7. `routers/` Directory

Each file in this directory defines an `APIRouter` instance and contains the API endpoints for a specific feature area.

*   **`auth.py`**: Handles user registration (`/register`), user login, and access token generation (`/token`).
*   **`logs.py`**: Manages log ingestion (`/log`), retrieval of all logs (`/logs`), filtering of alerts (`/alerts`), and real-time log streaming via WebSocket (`/ws/logs`).
*   **`stats.py`**: Provides aggregated statistics about logs and agents (`/stats`), used for dashboard overviews.

## 5. Data Flow

1.  **Log Ingestion**: Agents send log data (e.g., via HTTP POST) to the `/log` endpoint in `routers/logs.py`.
2.  **Risk Assessment**: The `rule_engine.py` processes the incoming log, assigns a risk score, and potentially categorizes it as an alert.
3.  **Data Storage**: Processed logs are stored in the SQLite database via `storage.py` (or direct SQLAlchemy operations).
4.  **Real-time Updates**: New logs are pushed to connected frontend clients via the WebSocket endpoint (`/ws/logs`).
5.  **Data Retrieval**: The frontend fetches historical logs, alerts, and statistics via REST API endpoints (`/logs`, `/alerts`, `/stats`) defined in their respective routers.
6.  **Authentication**: Users authenticate via the `/token` endpoint in `routers/auth.py`, receiving a JWT for subsequent authenticated requests.