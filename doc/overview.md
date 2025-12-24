# System Designer Documentation

**Central documentation hub for the System Designer project.**

## Quick Navigation

| Documentation | Description |
|---------------|-------------|
| [Architecture Guide](3-design/architecture.md) | System architecture and design decisions |
| [Developer Guide](4-development/developer-guide.md) | Development setup and contribution |
| [Backlog](backlog.md) | Planned features and improvements |

## Project Components

### System Designer Agent

**Path**: `system-designer-agent/`

A web-based consulting tool for designing AI agentic systems using a structured 8-step framework.

| Subcomponent | Technology | Documentation |
|--------------|------------|---------------|
| Backend | Rust, Axum 0.7 | [Architecture](3-design/architecture.md) |
| Frontend | React 19, TypeScript | [Architecture](3-design/architecture.md) |
| Desktop | Tauri 2.0 | [Integration](3-design/integration.md) |

## Documentation Structure

```
doc/
├── overview.md                    # This file - main hub
├── backlog.md                     # Feature backlog
├── 3-design/                      # Design documentation
│   ├── architecture.md            # System architecture (hub)
│   ├── data-flow.md               # Data lifecycle
│   ├── integration.md             # Web/Desktop integration
│   ├── sequence.md                # Interaction sequences
│   ├── toolchain.md               # Build tooling
│   ├── workflow.md                # Core workflows
│   └── uxui/                      # UX/UI specifications
│       └── flow-sequence.md       # User flow diagrams
└── 4-development/                 # Developer documentation
    ├── developer-guide.md         # Development hub
    └── guide/                     # Development guides
```

## Getting Started

### For Users

1. Start the application: `make dev`
2. Open http://localhost:5173
3. Follow the 8-step wizard to design your AI system
4. Download your specification as Markdown

### For Developers

1. See [Developer Guide](4-development/developer-guide.md) for setup
2. Review [Architecture](3-design/architecture.md) for system design
3. Check [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution guidelines

## The 8-Step Framework

The System Designer implements a comprehensive framework for AI system design:

| Step | Focus | Key Questions |
|------|-------|---------------|
| 1. Purpose & Scope | Intent | What problem? Who are users? |
| 2. System Prompt | Persona | What role? What boundaries? |
| 3. Choose LLM | Model | Which provider? What parameters? |
| 4. Tools & Integrations | Capabilities | What APIs? What functions? |
| 5. Memory Systems | State | Short-term? Long-term? Vector DB? |
| 6. Orchestration | Workflow | Patterns? Error handling? |
| 7. User Interface | Delivery | Platform? Interaction mode? |
| 8. Testing & Evals | Quality | Metrics? Evaluation strategy? |

## Related Resources

- [README](../README.md) - Quick start
- [SECURITY](../SECURITY.md) - Security policy
- [CONTRIBUTING](../CONTRIBUTING.md) - Contribution guidelines
- [SUPPORT](../SUPPORT.md) - Getting help
