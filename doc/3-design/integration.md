# Integrated System Architecture

**Audience**: Developers, Architects

## WHAT

This document describes how System Designer shares a common Rust core between its Web (Axum) and Desktop (Tauri) distributions.

### Scope

- Shared core architecture
- Web mode via Axum
- Desktop mode via Tauri
- Frontend communication patterns

## WHY

### Benefits of Shared Core

1. **Code Reuse** - Single implementation for business logic
2. **Consistency** - Identical behavior across platforms
3. **Maintainability** - Fix once, deploy everywhere
4. **Testing** - Test core logic independently

## HOW

### Architecture Diagram

```mermaid
graph TD
    subgraph "Frontend (React 19 + Tailwind v4)"
        UI[User Interface (Wizard)]
        State[Form State (useState)]

        UI -->|Updates| State
        State -->|Submits Data| API_Client
    end

    subgraph "Shared Rust Core (backend/src/lib.rs)"
        CoreLogic[core_generate_design()]
        Structs[Data Models (Serde)]

        CoreLogic -->|Uses| Structs
        CoreLogic -->|Returns| Markdown[String: DESIGN_SPEC.md]
    end

    subgraph "Web Mode (Axum)"
        Router[Axum Router]
        Handler[generate_design Handler]
        Middleware[CORS Middleware]

        Router --> Middleware
        Middleware --> Handler
        Handler -->|Calls| CoreLogic
        Handler -->|Wraps JSON| WebResponse
    end

    subgraph "Desktop Mode (Tauri)"
        TauriApp[Tauri Application]
        Command[generate_design_command]
        IPC[IPC Bridge (Invoke)]

        TauriApp --> IPC
        IPC --> Command
        Command -->|Calls| CoreLogic
        Command -->|Returns String| DesktopResponse
    end

    API_Client -->|HTTP POST (Web)| Router
    API_Client -.->|Tauri Invoke (Desktop)| TauriApp

    WebResponse -->|JSON| UI
    DesktopResponse -->|String| UI
```

### ASCII Representation

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React)                          │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                  Unified UI + State                     ││
│  └─────────────────────────────────────────────────────────┘│
│                           │                                  │
│              ┌────────────┴────────────┐                    │
│              ▼                         ▼                    │
│     ┌─────────────┐           ┌─────────────┐              │
│     │  HTTP POST  │           │ Tauri Invoke │              │
│     │   (Web)     │           │  (Desktop)   │              │
│     └──────┬──────┘           └──────┬──────┘              │
└────────────┼─────────────────────────┼──────────────────────┘
             │                         │
             ▼                         ▼
┌────────────────────┐    ┌────────────────────┐
│   Axum Server      │    │   Tauri Host       │
│  ┌──────────────┐  │    │  ┌──────────────┐  │
│  │   Handler    │  │    │  │   Command    │  │
│  └──────┬───────┘  │    │  └──────┬───────┘  │
└─────────┼──────────┘    └─────────┼──────────┘
          │                         │
          └───────────┬─────────────┘
                      ▼
         ┌────────────────────────┐
         │    Shared Rust Core    │
         │  core_generate_design()│
         │    Data Models (Serde) │
         └────────────────────────┘
```

### Key Components

| Component | Location | Purpose |
|-----------|----------|---------|
| Shared Core | `backend/src/lib.rs` | Business logic and data structures |
| Web Layer | `backend/src/main.rs` | HTTP API via Axum |
| Desktop Layer | `frontend/src-tauri` | Tauri commands via IPC |
| Frontend | `frontend/src` | Unified React application |

### Communication Modes

#### Web Mode

```typescript
// Frontend API call
const response = await fetch('/generate', {
  method: 'POST',
  body: JSON.stringify(formData)
});
```

#### Desktop Mode

```typescript
// Tauri invoke
const result = await invoke('generate_design', { data: formData });
```

### Platform Detection

The frontend detects the runtime environment:

```typescript
const isTauri = window.__TAURI__ !== undefined;

if (isTauri) {
  // Use Tauri invoke
} else {
  // Use HTTP API
}
```

## Related Documentation

- [Architecture](architecture.md) - Overall system design
- [Data Flow](data-flow.md) - Data processing lifecycle
- [Developer Guide](../4-development/developer-guide.md) - Setup instructions
