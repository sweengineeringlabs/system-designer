# Toolchain

**Audience**: Developers, DevOps

## WHAT

This document details the toolchain and development environment for System Designer.

## WHY

Understanding the toolchain:

1. **Onboarding** - New developers know what to install
2. **Consistency** - Team uses same tool versions
3. **Troubleshooting** - Identify version-related issues

## HOW

### Required Tools

| Tool | Version | Purpose | Installation |
|------|---------|---------|--------------|
| Rust | 1.77+ | Backend development | [rustup.rs](https://rustup.rs) |
| Bun | 1.0+ | Frontend package manager | [bun.sh](https://bun.sh) |
| Docker | 20.0+ | Containerization | [docker.com](https://docker.com) |
| Make | Any | Build automation | System package manager |

### Optional Tools

| Tool | Purpose | Installation |
|------|---------|--------------|
| cargo-watch | Hot reload for Rust | `cargo install cargo-watch` |
| Tauri CLI | Desktop builds | `cargo install tauri-cli` |

### Backend Toolchain

```
┌─────────────────────────────────────────────────┐
│                 Rust Toolchain                   │
├─────────────────────────────────────────────────┤
│  rustc ─── Compiler                             │
│  cargo ─── Package Manager                      │
│  rustfmt ─ Code Formatter                       │
│  clippy ── Linter                               │
└─────────────────────────────────────────────────┘
```

**Key Dependencies (Cargo.toml):**
- `axum` - Web framework
- `tokio` - Async runtime
- `serde` - Serialization
- `tower-http` - Middleware
- `tracing` - Logging

### Frontend Toolchain

```
┌─────────────────────────────────────────────────┐
│                 Frontend Toolchain               │
├─────────────────────────────────────────────────┤
│  bun ────── Runtime & Package Manager           │
│  vite ───── Build Tool                          │
│  tsc ────── TypeScript Compiler                 │
│  eslint ─── Linter                              │
└─────────────────────────────────────────────────┘
```

**Key Dependencies (package.json):**
- `react` - UI framework
- `typescript` - Type system
- `tailwindcss` - Styling
- `vite` - Bundler

### Build Commands

| Command | Description |
|---------|-------------|
| `make dev` | Start Docker development environment |
| `make build` | Production Docker build |
| `make test` | Run all tests |
| `make lint` | Run linters |
| `make clean` | Clean build artifacts |

### CI/CD Tools

- **GitHub Actions** - Automated testing and builds
- **Docker** - Container builds
- **Cargo** - Rust dependency management
- **Bun** - Frontend dependency management

### IDE Recommendations

| IDE | Extensions |
|-----|------------|
| VS Code | rust-analyzer, Tailwind CSS IntelliSense, ESLint |
| IntelliJ | Rust plugin, React plugin |

## Related Documentation

- [Developer Guide](../4-development/developer-guide.md) - Setup instructions
- [Architecture](architecture.md) - System design
