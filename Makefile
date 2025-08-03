# SentinelMesh Development Makefile

.PHONY: help setup dev build test clean logs stop restart

# Default target
help:
	@echo "SentinelMesh Development Commands:"
	@echo ""
	@echo "  setup     - Initial project setup (copy .env.example to .env)"
	@echo "  dev       - Start development environment"
	@echo "  build     - Build all services"
	@echo "  test      - Run tests"
	@echo "  clean     - Clean up containers and volumes"
	@echo "  logs      - Show logs from all services"
	@echo "  stop      - Stop all services"
	@echo "  restart   - Restart all services"
	@echo ""
	@echo "  dev-backend   - Start only backend service"
	@echo "  dev-frontend  - Start only frontend service"
	@echo "  dev-legacy    - Start with legacy Streamlit dashboard"
	@echo "  dev-postgres  - Start with PostgreSQL database"
	@echo ""

# Initial setup
setup:
	@if [ ! -f .env ]; then \
		cp .env.example .env; \
		echo "✅ Created .env file from .env.example"; \
		echo "📝 Please edit .env file with your configuration"; \
	else \
		echo "⚠️  .env file already exists"; \
	fi

# Development environment
dev: setup
	@echo "🚀 Starting SentinelMesh development environment..."
	docker compose up --build

# Build all services
build:
	@echo "🔨 Building all services..."
	docker compose build

# Run tests
test:
	@echo "🧪 Running tests..."
	docker compose exec backend python -m pytest
	docker compose exec frontend npm test

# Clean up
clean:
	@echo "🧹 Cleaning up containers and volumes..."
	docker compose down -v --remove-orphans
	docker system prune -f

# Show logs
logs:
	docker compose logs -f

# Stop services
stop:
	@echo "⏹️  Stopping all services..."
	docker compose down

# Restart services
restart: stop dev

# Development variants
dev-backend:
	@echo "🚀 Starting backend only..."
	docker compose up --build backend

dev-frontend:
	@echo "🚀 Starting frontend only..."
	docker compose up --build frontend

dev-legacy:
	@echo "🚀 Starting with legacy Streamlit dashboard..."
	docker compose --profile legacy up --build

dev-postgres:
	@echo "🚀 Starting with PostgreSQL database..."
	docker compose --profile postgres up --build

# Health check
health:
	@echo "🏥 Checking service health..."
	@curl -f http://localhost:8000/health || echo "❌ Backend unhealthy"
	@curl -f http://localhost:5173/health || echo "❌ Frontend unhealthy"

# Database operations
db-migrate:
	@echo "🗃️  Running database migrations..."
	docker compose exec backend python -m alembic upgrade head

db-reset:
	@echo "🗃️  Resetting database..."
	docker compose exec backend rm -f sentinelmesh.db
	docker compose restart backend

