# SentinelMesh Dashboard: Project Overview

## 1. Introduction

SentinelMesh is a security mesh dashboard designed for autonomous AI agents. It provides real-time monitoring, advanced analytics, and robust security features to ensure the safe and efficient operation of AI systems. This project aims to offer a comprehensive solution for tracking agent activities, identifying risks, and managing security alerts in a centralized, user-friendly interface.

## 2. Project Goals

The primary goals of the SentinelMesh Dashboard are:

*   **Real-time Visibility**: Provide immediate insights into AI agent activities and system health.
*   **Risk Assessment**: Implement a rule engine for dynamic risk assessment of log entries.
*   **Alerting & Notifications**: Notify users of critical security events and anomalies.
*   **Modular & Scalable Architecture**: Ensure the application is easy to maintain, extend, and scale for enterprise-level deployments.
*   **User-Friendly Interface**: Offer an intuitive and responsive dashboard experience.
*   **Secure Operations**: Implement robust authentication, authorization, and data handling practices.

## 3. Architecture Overview

SentinelMesh follows a client-server architecture, divided into a Frontend (React) and a Backend (FastAPI).

### 3.1. Frontend (React.js)

The frontend is a single-page application built with React.js, utilizing `shadcn/ui` for UI components, `Tailwind CSS` for styling, and `Framer Motion` for animations. It consumes data from the FastAPI backend via REST APIs and WebSockets.

**Key Architectural Principles:**

*   **Modular Components**: UI is broken down into small, reusable components (e.g., `DataTable`, `StatsCard`).
*   **Feature Pages**: Each major dashboard section (Logs, Alerts, Agents, Risk, Dashboard) is encapsulated in its own page component (`LogsPage.jsx`, `AlertsPage.jsx`, etc.).
*   **Custom Hooks**: Reusable stateful logic and side effects (like data fetching, theme management, mobile detection) are abstracted into custom React hooks (`useLogsData`, `useTheme`, etc.).
*   **Centralized API Client**: All API interactions are handled through a single `api.js` client for consistent request handling, authentication, and error management.

**Directory Structure (Frontend - `frontend/sentinelmesh-dashboard/src/`):**

```
src/
├── App.jsx             # Main application component, orchestrates pages and global state
├── AuthContext.jsx     # React Context for authentication management
├── Login.jsx           # Login component
├── Register.jsx        # Registration component
├── main.jsx            # Entry point for the React application
├── App.css             # Global application styles
├── index.css           # Base CSS
├── components/         # Reusable UI components (e.g., DataTable, AnimatedCounter)
│   ├── ui/             # shadcn/ui components (if customized)
│   └── ...
├── hooks/              # Custom React hooks (e.g., useLogsData, useTheme)
│   ├── useLogsData.js
│   ├── useTheme.js
│   ├── useMobileDetection.js
│   ├── useNotificationsToggle.js
│   └── useAutoRefreshToggle.js
├── lib/                # Utility functions and API client
│   └── api.js          # Centralized API client
└── pages/              # Feature-specific page components
    ├── LogsPage.jsx
    ├── AlertsPage.jsx
    ├── AgentsPage.jsx
    ├── RiskPage.jsx
    └── DashboardPage.jsx
```

### 3.2. Backend (FastAPI)

The backend is built with FastAPI, a modern, fast (high-performance) web framework for building APIs with Python 3.7+ based on standard Python type hints. It handles data ingestion, processing, storage, and serves data to the frontend.

**Key Architectural Principles:**

*   **Modular Routers**: API endpoints are organized into feature-specific `APIRouter` instances (e.g., `auth.py`, `logs.py`, `stats.py`).
*   **Dependency Injection**: FastAPI's dependency injection system is used for managing shared logic like authentication and database access.
*   **Pydantic Models**: Data validation and serialization are handled using Pydantic models.
*   **SQLite Database**: Simple, file-based database for demonstration and easy setup.
*   **Rule Engine**: A custom rule engine (`rules/rule_engine.py`) for real-time risk assessment of incoming logs.
*   **WebSockets**: Provides real-time log updates to connected frontend clients.

**Directory Structure (Backend - `backend/`):**

```
backend/
├── main.py             # Main FastAPI application, includes routers
├── models.py           # Pydantic models for request/response data
├── sqlite.py           # Database interaction logic (SQLite)
├── storage.py          # (If used) Abstraction for data storage
├── auth.py             # Authentication utilities and security functions
├── rules/              # Rule engine for risk assessment
│   └── rule_engine.py
├── routers/            # FastAPI APIRouter modules
│   ├── auth.py         # Authentication endpoints
│   ├── logs.py         # Log and alert endpoints, WebSocket
│   └── stats.py        # Statistics endpoints
├── Dockerfile          # Docker configuration for deployment
├── requirements.txt    # Python dependencies
└── pyproject.toml      # Project configuration
```

## 4. Setup and Running Locally

To set up and run the SentinelMesh Dashboard on your local machine, follow these steps:

### 4.1. Prerequisites

*   Node.js (LTS version recommended)
*   npm or Yarn
*   Python 3.8+
*   pip or pipenv/poetry
*   Git

### 4.2. Clone the Repository

```bash
git clone <your-repository-url>
cd sentinelmesh
```

### 4.3. Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```
2.  **Create a Python virtual environment (recommended):**
    ```bash
    python3 -m venv venv
    source venv/bin/activate  # On Windows: .\venv\Scripts\activate
    ```
3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
4.  **Create a `.env` file:**
    In the `backend/` directory, create a file named `.env` and add your secret key:
    ```
    SECRET_KEY="your-super-secret-key-here"
    ```
    (Replace `your-super-secret-key-here` with a strong, random string).
5.  **Run the backend server:**
    ```bash
    uvicorn main:app --reload --host 0.0.0.0 --port 8000
    ```
    The backend API will be accessible at `http://localhost:8000`.

### 4.4. Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd ../frontend/sentinelmesh-dashboard
    ```
2.  **Install Node.js dependencies:**
    ```bash
    npm install  # or yarn install
    ```
3.  **Create a `.env` file:**
    In the `frontend/sentinelmesh-dashboard/` directory, create a file named `.env` and add your API base URL:
    ```
    VITE_API_BASE_URL="http://localhost:8000"
    ```
4.  **Run the frontend development server:**
    ```bash
    npm run dev  # or yarn dev
    ```
    The frontend dashboard will typically be accessible at `http://localhost:5173` (or another port if 5173 is in use).

## 5. Deployment

This project is designed to be deployable to platforms like Render.com. The `Dockerfile` in the `backend/` directory is configured for deploying the FastAPI application, and the `frontend/sentinelmesh-dashboard/dist` directory (generated by `npm run build`) can be served as static files or deployed as a separate static site.

*   **Backend Deployment**: Refer to the `Dockerfile` and Render's Python/FastAPI deployment guides.
*   **Frontend Deployment**: Build the React app (`npm run build`) and deploy the `dist` folder as a static site. Ensure the `VITE_API_BASE_URL` in the frontend's `.env` points to your deployed backend API URL.

## 6. Contributing

Contributions are welcome! Please refer to the `CONTRIBUTING.md` (to be created) for guidelines on how to contribute to this project.

