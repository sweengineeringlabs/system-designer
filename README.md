# System Designer

**AI System Architecture Tool** - A web-based consulting tool for designing robust AI agentic systems using a structured 8-step framework.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Features

- Interactive 8-step wizard for comprehensive AI system design
- Real-time validation and guidance
- Markdown specification generation
- Downloadable design documents
- Web and desktop (Tauri) support

## Quick Start

```bash
# Clone and start with Docker
git clone https://github.com/adentic/system-designer.git
cd system-designer
make dev

# Access the application
# Frontend: http://localhost:5173
# Backend:  http://localhost:3000
```

### Manual Setup

```bash
# Backend (Rust)
cd system-designer-agent/backend
cargo run

# Frontend (React) - in another terminal
cd system-designer-agent/frontend
bun install
bun run dev
```

## The 8-Step Framework

1. **Purpose & Scope** - Define use case, constraints, success criteria
2. **System Prompt** - Agent role, goals, guardrails
3. **Choose LLM** - Model selection, parameters
4. **Tools & Integrations** - APIs, MCP servers
5. **Memory Systems** - Vector DB, episodic memory
6. **Orchestration** - Workflow patterns, error handling
7. **User Interface** - Platform, interaction mode
8. **Testing & Evals** - Quality metrics, evaluation strategy

## Documentation

See [doc/overview.md](doc/overview.md) for complete documentation.

## Tech Stack

| Component | Technology |
|-----------|------------|
| Backend | Rust, Axum 0.7, Tokio |
| Frontend | React 19, TypeScript, Tailwind CSS v4 |
| Desktop | Tauri 2.0 |
| Build | Vite, Bun, Docker |

## License

MIT - See [LICENSE](LICENSE)
