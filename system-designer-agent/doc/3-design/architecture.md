# System Architecture: System Designer Agent

## 1. Overview
The System Designer Agent is a web-based consulting tool designed to help developers architect robust AI agentic systems. It follows an 8-step framework to ensure all critical components (from prompt design to orchestration and memory) are considered.

## 2. Technology Stack
- **Frontend:** React 19.1.4, Tailwind CSS v4.1, Vite 6 (Bundler), Bun 1.2.22 (Package Manager/Runtime)
- **Backend:** Rust 1.91.1 (Targeting 1.92 compatibility), Axum 0.7 (Web Framework), Tokio (Async Runtime)
- **Communication:** REST API (JSON) with CORS enabled for local development.

## 3. Component Architecture

### 3.1 Frontend (./frontend)
- **State Management:** React `useState` for wizard-style form tracking.
- **UI Components:** 
    - `App.jsx`: Main orchestration of the wizard steps and API interaction.
    - `Input/TextArea`: Reusable styled primitives using Tailwind v4 utility classes.
- **Design Pattern:** Step-wise Wizard. Each step corresponds to a section of the 8-part framework.

### 3.2 Backend (./backend)
- **Web Server:** Axum handling routing and CORS middleware.
- **Data Models:** Serde-powered Rust structs for type-safe request/response handling.
- **Logic:** `generate_design` handler which performs template-based Markdown generation from structured input.

## 4. 8-Step Framework Implementation
1. **Define Purpose & Scope:** Capture intent and constraints.
2. **System Prompt Design:** Define the agent's persona and logic.
3. **Choose LLM:** Model selection and hyperparameter tuning.
4. **Tools & Integrations:** Capability definition (APIs/MCP).
5. **Memory Systems:** Long-term and short-term state management.
6. **Orchestration:** Workflow logic (Routers, Chains, etc.).
7. **User Interface:** Deployment platform (Chat, Slack, Web).
8. **Testing & Evals:** Quality assurance strategies.

## 5. Data Flow & Sequence
Detailed specifications of the system's data processing and interaction flows have been externalized to ensure clarity and maintainability.

- **[Data Flow Specification](./data-flow.md):** details the lifecycle of user input from React state to Rust structs.
- **[Sequence Diagram](./sequence.md):** visualizes the synchronous HTTP interaction between the frontend and backend.

## 6. Directory Structure
```text
system-designer-agent/
├── backend/            # Rust source code
│   ├── src/main.rs     # Axum server and logic
│   └── Cargo.toml      # Rust dependencies
├── frontend/           # React source code
│   ├── src/App.jsx     # Main UI logic
│   ├── src/index.css   # Tailwind v4 entry
│   └── package.json    # Bun dependencies
└── doc/3-design/       # Documentation
```
