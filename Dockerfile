# =============================================================================
# STAGE 1: Build Rust Backend
# =============================================================================
FROM rust:1.77-slim-bookworm AS backend-builder

WORKDIR /app

RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

COPY system-designer-agent/backend/Cargo.toml system-designer-agent/backend/Cargo.lock ./
COPY system-designer-agent/backend/src ./src

RUN cargo build --release

# =============================================================================
# STAGE 2: Build Frontend
# =============================================================================
FROM oven/bun:1 AS frontend-builder

WORKDIR /app

COPY system-designer-agent/frontend/package.json system-designer-agent/frontend/bun.lock* ./

RUN bun install --frozen-lockfile

COPY system-designer-agent/frontend/ ./

RUN bun run build

# =============================================================================
# STAGE 3: Production Runtime
# =============================================================================
FROM debian:bookworm-slim AS production

WORKDIR /app

RUN apt-get update && apt-get install -y \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy backend binary
COPY --from=backend-builder /app/target/release/backend /app/backend

# Copy frontend static files
COPY --from=frontend-builder /app/dist /app/static

# Create non-root user
RUN useradd -m -u 1000 appuser
USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

ENV APP_HOST=0.0.0.0
ENV APP_PORT=3000
ENV APP_LOG_LEVEL=info

CMD ["/app/backend"]
