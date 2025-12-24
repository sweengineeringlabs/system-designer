# Contributing to System Designer

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment.

## How to Contribute

### Reporting Bugs

1. Check if the issue already exists
2. Use the bug report template
3. Include:
   - Clear description of the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, browser, versions)

### Suggesting Features

1. Check the [backlog](doc/backlog.md) for planned features
2. Use the feature request template
3. Describe the use case and benefits

### Submitting Code

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Run tests and linting
5. Commit with clear messages
6. Push to your fork
7. Open a Pull Request

## Development Setup

### Prerequisites

- Rust 1.77+
- Bun 1.0+
- Docker (optional, for containerized development)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/adentic/system-designer.git
cd system-designer

# Start development environment
make dev

# Or manually:
cd system-designer-agent/backend && cargo run &
cd system-designer-agent/frontend && bun install && bun run dev
```

### Running Tests

```bash
# All tests
make test

# Backend only
cd system-designer-agent/backend && cargo test

# Frontend only
cd system-designer-agent/frontend && bun run test
```

### Code Quality

```bash
# Run linting
make lint

# Format code
cd system-designer-agent/backend && cargo fmt
cd system-designer-agent/frontend && bun run lint
```

## Pull Request Guidelines

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] Tests pass locally
- [ ] Linting passes
- [ ] Documentation updated if needed
- [ ] Commit messages are clear and descriptive

### PR Title Format

Use conventional commit format:
- `feat: add new feature`
- `fix: resolve bug`
- `docs: update documentation`
- `refactor: code improvement`
- `test: add tests`

### Review Process

1. Maintainers will review within 3-5 business days
2. Address any requested changes
3. Once approved, a maintainer will merge

## Project Structure

```
system-designer/
├── system-designer-agent/
│   ├── backend/          # Rust Axum server
│   └── frontend/         # React + Tailwind UI
├── doc/                  # Project documentation
│   ├── 3-design/         # Architecture docs
│   └── 4-development/    # Developer guides
└── .github/              # GitHub templates
```

## Style Guidelines

### Rust

- Follow Rust standard style (rustfmt)
- Use meaningful variable names
- Document public APIs

### TypeScript/React

- Use TypeScript strict mode
- Follow ESLint configuration
- Use functional components with hooks

### Documentation

- Use WHAT-WHY-HOW structure
- Keep language clear and concise
- Update relevant docs with code changes

## Questions?

See [SUPPORT.md](SUPPORT.md) for how to get help.
