# Integrated System Architecture

This diagram illustrates how the System Designer Agent shares a common Rust core between its Web (Axum) and Desktop (Tauri) distributions.

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

## Key Components

1.  **Shared Core (`backend/src/lib.rs`):** Contains the business logic (`core_generate_design`) and data structures. It is pure Rust and framework-agnostic.
2.  **Web Layer (`backend/src/main.rs`):** An Axum server that wraps the core logic in an HTTP API.
3.  **Desktop Layer (`frontend/src-tauri`):** A Tauri host that wraps the core logic in local commands, reachable via IPC.
4.  **Frontend (`frontend/src`):** A unified React application that can communicate with either the Web API or the Tauri Bridge.
