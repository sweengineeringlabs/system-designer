.PHONY: help dev build test lint docker-build docker-up docker-down clean tauri-dev tauri-build

help:
	@echo "System Designer - Available Commands:"
	@echo "  make dev          - Start development environment (docker-compose)"
	@echo "  make build        - Build production Docker image"
	@echo "  make test         - Run all tests"
	@echo "  make lint         - Run all linters"
	@echo "  make docker-up    - Start production containers"
	@echo "  make docker-down  - Stop all containers"
	@echo "  make clean        - Clean build artifacts"
	@echo "  make tauri-dev    - Run Tauri in development mode"
	@echo "  make tauri-build  - Build Tauri application"

dev:
	docker-compose up --build

build:
	docker build -t system-designer:latest .

test: test-backend test-frontend

test-backend:
	cd system-designer-agent/backend && cargo test

test-frontend:
	cd system-designer-agent/frontend && bun run test

lint: lint-backend lint-frontend

lint-backend:
	cd system-designer-agent/backend && cargo fmt --check && cargo clippy -- -D warnings

lint-frontend:
	cd system-designer-agent/frontend && bun run typecheck

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

tauri-dev:
	cd system-designer-agent/frontend && bun run tauri dev

tauri-build:
	cd system-designer-agent/frontend && bun run tauri build

clean:
	rm -rf system-designer-agent/backend/target
	rm -rf system-designer-agent/frontend/dist
	rm -rf system-designer-agent/frontend/node_modules
	rm -rf system-designer-agent/frontend/src-tauri/target
	docker-compose down -v --rmi local 2>/dev/null || true
