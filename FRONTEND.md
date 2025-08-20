# SentinelMesh Dashboard: Frontend Architecture

This document details the architecture and key components of the SentinelMesh Dashboard frontend, built with React.js. The frontend is designed for modularity, reusability, and maintainability, adhering to modern React best practices.

## 1. Technology Stack

*   **React.js**: A JavaScript library for building user interfaces.
*   **Vite**: A fast build tool that provides a lightning-fast development experience.
*   **Tailwind CSS**: A utility-first CSS framework for rapidly building custom designs.
*   **shadcn/ui**: A collection of reusable components built with Radix UI and Tailwind CSS, providing accessible and customizable UI elements.
*   **Framer Motion**: A production-ready motion library for React, used for animations and transitions.
*   **Lucide React**: A collection of beautiful, pixel-perfect icons.
*   **Recharts**: A composable charting library built on React components.

## 2. Core Architectural Principles

### 2.1. Component-Based Structure

The UI is broken down into a hierarchy of components, each responsible for a specific part of the interface. Components are categorized based on their scope and reusability:

*   **Pages**: Top-level components representing distinct views or tabs in the dashboard (e.g., Logs, Alerts, Dashboard).
*   **Reusable UI Components**: Generic, presentational components that can be used across different parts of the application (e.g., `Button`, `Card`, `DataTable`).
*   **Custom Hooks**: Encapsulate stateful logic and side effects, making components cleaner and logic reusable.

### 2.2. Separation of Concerns

Logic is clearly separated:

*   **Presentation Logic**: Handled by UI components and pages.
*   **Business Logic**: Managed within custom hooks or utility functions.
*   **Data Fetching & State Management**: Centralized in custom hooks (`useLogsData`) and a dedicated API client (`api.js`).

### 2.3. Centralized API Client

All interactions with the backend API are routed through a single `api.js` client. This ensures consistent handling of authentication headers, base URL configuration, and error management across all API calls.

## 3. Directory Structure

The frontend source code (`frontend/sentinelmesh-dashboard/src/`) is organized as follows:

```
src/
├── App.jsx             # Main application component, orchestrates pages and global state
├── AuthContext.jsx     # React Context for authentication management
├── Login.jsx           # Login component
├── Register.jsx        # Registration component
├── main.jsx            # Entry point for the React application
├── App.css             # Global application styles
├── index.css           # Base CSS
├── components/         # Reusable UI components
│   ├── ui/             # shadcn/ui components (if customized)
│   ├── DataTable.jsx   # Generic table component
│   ├── AnimatedCounter.jsx
│   └── StatusIndicator.jsx
├── hooks/              # Custom React hooks
│   ├── useLogsData.js          # Fetches and manages logs/alerts data, handles WebSocket
│   ├── useTheme.js             # Manages dark/light mode
│   ├── useMobileDetection.js   # Detects mobile viewport
│   ├── useNotificationsToggle.js # Manages notification preference
│   └── useAutoRefreshToggle.js # Manages auto-refresh preference
├── lib/                # Utility functions and API client
│   └── api.js          # Centralized API client for backend communication
└── pages/              # Feature-specific page components
    ├── LogsPage.jsx        # Displays and manages log entries
    ├── AlertsPage.jsx      # Displays and manages security alerts
    ├── AgentsPage.jsx      # Displays and manages agent-related data
    ├── RiskPage.jsx        # Displays risk analysis and visualizations
    └── DashboardPage.jsx   # Provides an overview of key metrics
```

## 4. Key Components and Their Roles

### 4.1. `App.jsx`

The `App.jsx` file serves as the main entry point for the dashboard application after authentication. Its primary responsibilities include:

*   **Global State Management**: Manages global states such as `activeTab`.
*   **Hook Orchestration**: Integrates various custom hooks (`useLogsData`, `useTheme`, etc.) to provide global data and functionality.
*   **Layout & Navigation**: Defines the overall layout of the dashboard, including the sidebar navigation and the main content area, using `shadcn/ui` Tabs component.
*   **Authentication Flow**: Handles the conditional rendering of login/registration forms versus the main dashboard content based on user authentication status.

### 4.2. `AuthContext.jsx`

Provides authentication context to the entire application. It manages user login, registration, token storage, and logout functionality, making authentication status globally accessible via the `useAuth` hook.

### 4.3. `pages/` Directory

Each file in this directory represents a distinct page or view within the dashboard, corresponding to a tab in the navigation. They are responsible for orchestrating data display and user interactions specific to their feature.

*   **`LogsPage.jsx`**: Displays a detailed table of log entries, including filtering, search, and export options.
*   **`AlertsPage.jsx`**: Focuses on high-risk alerts, providing tools for review and management.
*   **`AgentsPage.jsx`**: Visualizes data related to active agents, their status, and activity patterns.
*   **`RiskPage.jsx`**: Presents risk assessment data through various charts and metrics.
*   **`DashboardPage.jsx`**: Offers a high-level summary of system status, key metrics, and recent activities.

### 4.4. `components/` Directory

Contains smaller, reusable UI components. These components are typically presentational and receive data via props.

*   **`DataTable.jsx`**: A generic, reusable table component capable of displaying various datasets with features like sorting.
*   **`AnimatedCounter.jsx`**: Displays numbers with a smooth animation effect.
*   **`StatusIndicator.jsx`**: A visual indicator for system or connection status.
*   **`ui/`**: Houses components directly from `shadcn/ui` or custom wrappers around them.

### 4.5. `hooks/` Directory

Contains custom React hooks that encapsulate reusable stateful logic and side effects.

*   **`useLogsData.js`**: Manages the fetching of logs and alerts from the backend, handles WebSocket connections for real-time updates, and provides `loading` and `isConnected` status.
*   **`useTheme.js`**: Manages the dark/light mode state, persists the preference in `localStorage`, and applies the correct CSS class to the `document.documentElement`.
*   **`useMobileDetection.js`**: Provides a boolean `isMobile` state based on the viewport width, useful for responsive rendering.
*   **`useNotificationsToggle.js`**: Manages the state of the notification preference switch.
*   **`useAutoRefreshToggle.js`**: Manages the state of the auto-refresh preference switch.

### 4.6. `lib/api.js`

This module exports a centralized API client object. It abstracts away the complexities of `fetch` API calls, automatically includes authentication tokens, handles JSON parsing, and provides a consistent interface for interacting with the backend. It also manages the `VITE_API_BASE_URL` from environment variables.

## 5. State Management

Frontend state is managed using a combination of:

*   **React Context (AuthContext)**: For global, application-wide state like authentication status.
*   **`useState` and `useEffect` hooks**: For component-specific local state and side effects.
*   **Custom Hooks**: For encapsulating and sharing complex stateful logic across multiple components, promoting reusability and cleaner component code.

## 6. Styling

*   **Tailwind CSS**: Used for rapid UI development through utility classes.
*   **`App.css` / `index.css`**: For global styles and custom CSS that cannot be achieved with Tailwind utilities.

## 7. Responsive Design

The dashboard is designed to be fully responsive, adapting its layout and components for optimal viewing on various screen sizes (desktop, tablet, mobile). This is achieved through:

*   **Tailwind CSS responsive utilities** (e.g., `lg:`, `md:`).
*   **Conditional rendering** based on `useMobileDetection` hook.
*   **Flexible layouts** using Flexbox and Grid.
