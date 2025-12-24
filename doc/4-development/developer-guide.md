# Developer Guide

**Audience**: Developers, Contributors

## WHAT

This guide covers development setup, workflows, and best practices for contributing to System Designer.

### Scope

- Local development environment setup
- Build and test commands
- Code organization and patterns
- Contribution workflow

## WHY

### Problems Addressed

1. **Onboarding Friction** - New contributors need clear setup instructions
2. **Inconsistent Practices** - Development patterns should be documented
3. **Build Complexity** - Multi-language project requires coordination

### Benefits

- Fast developer onboarding
- Consistent code quality
- Reproducible builds

## HOW

### Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Rust | 1.77+ | Backend development |
| Bun | 1.0+ | Frontend package manager |
| Docker | 20.0+ | Containerized development |
| Make | Any | Build automation |

### Quick Setup

```bash
# Clone repository
git clone https://github.com/adentic/system-designer.git
cd system-designer

# Start with Docker (recommended)
make dev

# Access
# Frontend: http://localhost:5173
# Backend:  http://localhost:3000
```

### Manual Setup

#### Backend

```bash
cd system-designer-agent/backend

# Install Rust (if needed)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Run development server
cargo run

# Run with hot reload
cargo watch -x run
```

#### Frontend

```bash
cd system-designer-agent/frontend

# Install dependencies
bun install

# Run development server
bun run dev

# Type checking
bun run typecheck
```

### Project Structure

```
system-designer/
├── system-designer-agent/
│   ├── backend/              # Rust API server
│   │   ├── src/
│   │   │   ├── main.rs       # Entry point
│   │   │   ├── lib.rs        # Core logic
│   │   │   └── ...
│   │   └── Cargo.toml
│   └── frontend/             # React application
│       ├── src/
│       │   ├── App.tsx       # Main component
│       │   ├── components/   # UI components
│       │   ├── hooks/        # React hooks
│       │   └── services/     # API client
│       └── package.json
├── doc/                      # Documentation
├── Makefile                  # Build automation
├── docker-compose.yml        # Development containers
└── Dockerfile               # Production build
```

### Common Commands

| Command | Description |
|---------|-------------|
| `make dev` | Start Docker development environment |
| `make test` | Run all tests |
| `make lint` | Run linters |
| `make build` | Production build |
| `make clean` | Clean build artifacts |

### Testing

#### Backend Tests

```bash
cd system-designer-agent/backend
cargo test
```

#### Frontend Tests

```bash
cd system-designer-agent/frontend
bun run test
```

### Code Style

#### Rust

- Follow `rustfmt` defaults
- Run `cargo fmt` before committing
- Run `cargo clippy` for lint warnings

#### TypeScript

- Use TypeScript strict mode
- Follow ESLint configuration
- Use functional components with hooks

### Environment Variables

See `.env.example` for available configuration:

| Variable | Default | Description |
|----------|---------|-------------|
| `APP_HOST` | 127.0.0.1 | Backend bind address |
| `APP_PORT` | 3000 | Backend port |
| `APP_CORS_ORIGINS` | localhost | CORS whitelist |
| `APP_LOG_LEVEL` | info | Logging verbosity |
| `VITE_API_URL` | http://localhost:3000 | Frontend API URL |

### Debugging

#### Backend

```bash
# Enable debug logging
RUST_LOG=debug cargo run

# Enable backtrace
RUST_BACKTRACE=1 cargo run
```

#### Frontend

- Use React DevTools browser extension
- Check browser console for errors
- Use `console.log` or React's built-in debugging

### Contribution Workflow

1. Fork the repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Make changes and test
4. Run linting: `make lint`
5. Commit with clear messages
6. Push and open Pull Request

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for detailed guidelines.

## Related Documentation

- [Architecture](../3-design/architecture.md) - System design
- [Data Flow](../3-design/data-flow.md) - Data processing
- [CONTRIBUTING](../../CONTRIBUTING.md) - Contribution guidelines
