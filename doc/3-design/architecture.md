# System Architecture

**Audience**: Architects, Technical Leadership, Contributors

## WHAT

System Designer is a web-based consulting tool for designing AI agentic systems. It implements an 8-step framework guiding users through comprehensive system specification.

### Scope

- Frontend wizard UI (React + TypeScript)
- Backend API server (Rust + Axum)
- Desktop application bridge (Tauri)
- Markdown specification generation

### Out of Scope

- AI model execution
- Runtime agent deployment
- Infrastructure provisioning

## WHY

### Problems Addressed

1. **Inconsistent AI System Design** - No structured approach for agent architecture
2. **Missing Considerations** - Easy to overlook memory, orchestration, testing
3. **Documentation Gap** - Specifications scattered or non-existent
4. **Knowledge Silos** - Design decisions not captured systematically

### Benefits

- Structured 8-step framework ensures completeness
- Generated Markdown provides consistent documentation
- Web + desktop flexibility for different workflows
- Type-safe implementation prevents common errors

## HOW

### Technology Stack

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React 19)                   │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │ Wizard Steps│  │  Components  │  │  State/Hooks  │  │
│  └─────────────┘  └──────────────┘  └───────────────┘  │
├─────────────────────────────────────────────────────────┤
│                    HTTP / REST API                       │
├─────────────────────────────────────────────────────────┤
│                   Backend (Rust/Axum)                    │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │   Routing   │  │  Validation  │  │   Generation  │  │
│  └─────────────┘  └──────────────┘  └───────────────┘  │
├─────────────────────────────────────────────────────────┤
│                   Desktop (Tauri 2.0)                    │
│           Shared Rust core, native window               │
└─────────────────────────────────────────────────────────┘
```

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | React 19, TypeScript, Tailwind v4 | Interactive wizard UI |
| API | REST/JSON, CORS | Frontend-backend communication |
| Backend | Rust 1.77+, Axum 0.7, Tokio | Request handling, validation, generation |
| Desktop | Tauri 2.0 | Native window, IPC bridge |

### Component Architecture

#### Frontend (`system-designer-agent/frontend/`)

```
src/
├── App.tsx              # Main wizard orchestration
├── components/
│   ├── ui/              # Reusable primitives
│   │   ├── Input.tsx
│   │   ├── TextArea.tsx
│   │   └── CheckboxCard.tsx
│   └── ErrorBoundary.tsx
├── hooks/
│   ├── useWizard.ts     # Step navigation
│   └── useFormData.ts   # Form state
├── services/
│   └── api.ts           # HTTP client
└── types/
    └── index.ts         # TypeScript interfaces
```

#### Backend (`system-designer-agent/backend/`)

```
src/
├── main.rs              # Tokio runtime, server startup
├── lib.rs               # Router, handlers, core logic
├── config.rs            # Environment configuration
├── error.rs             # Error types and handling
├── health.rs            # Health check endpoints
├── logging.rs           # Tracing setup
├── extractors.rs        # Request validation
└── middleware/
    ├── cors.rs          # CORS configuration
    └── security.rs      # Security headers
```

### 8-Step Framework Mapping

| Step | Frontend | Backend |
|------|----------|---------|
| 1. Purpose & Scope | Step 1 form fields | `Purpose` struct |
| 2. System Prompt | Step 2 form fields | `Prompt` struct |
| 3. Choose LLM | Step 3 form fields | `ModelConfig` struct |
| 4. Tools & Integrations | Step 4 form fields | `Tools` struct |
| 5. Memory Systems | Step 5 form fields | `Memory` struct |
| 6. Orchestration | Step 6 form fields | `Orchestration` struct |
| 7. User Interface | Step 7 form fields | `Interface` struct |
| 8. Testing & Evals | Step 8 form fields | `Testing` struct |

### Data Flow

See [data-flow.md](data-flow.md) for detailed data lifecycle.

```
User Input → React State → JSON Request → Rust Structs → Markdown → Download
```

### Key Design Decisions

1. **Shared Rust Core**: Same generation logic for web and desktop
2. **Type-Safe API**: Serde structs match TypeScript interfaces
3. **Progressive Wizard**: Step-by-step reduces cognitive load
4. **Markdown Output**: Universal, version-controllable format

## Related Documentation

- [Data Flow](data-flow.md) - Input processing lifecycle
- [Integration](integration.md) - Web/Desktop integration details
- [Sequence Diagrams](sequence.md) - Interaction flows
- [Developer Guide](../4-development/developer-guide.md) - Development setup
