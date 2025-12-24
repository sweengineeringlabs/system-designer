# Sequence Diagrams

**Audience**: Developers, Architects

## WHAT

This document illustrates the interaction flow for generating a System Design Document through sequence diagrams.

## WHY

Sequence diagrams provide:

1. **Visual clarity** - Understand message flow at a glance
2. **Integration insight** - See component boundaries
3. **Debugging aid** - Trace request/response paths

## HOW

### Design Generation Flow

```mermaid
sequenceDiagram
    actor User
    participant Frontend as React App (Bun)
    participant Backend as Axum Server (Rust)

    Note over User, Frontend: User completes the 8-Step Wizard

    User->>Frontend: Fills Input Fields (Purpose, Model, Tools...)
    User->>Frontend: Clicks "Generate Design"

    rect rgb(240, 248, 255)
        Note right of Frontend: Data Transformation
        Frontend->>Frontend: Split Strings to Arrays
        Frontend->>Frontend: Clean & Validate Inputs
    end

    Frontend->>Backend: POST /generate (JSON Payload)
    activate Backend

    Note right of Backend: Processing
    Backend->>Backend: Deserialize JSON to Rust Struct
    Backend->>Backend: Map Fields to Markdown Template

    Backend-->>Frontend: 200 OK (JSON { "markdown": "..." })
    deactivate Backend

    Frontend->>User: Display Generated Markdown
    User->>Frontend: Download "DESIGN_SPEC.md"
```

### ASCII Representation

```
User          Frontend              Backend
 │               │                     │
 │──Fill Form───▶│                     │
 │               │                     │
 │──Generate────▶│                     │
 │               │──Transform Data────▶│
 │               │                     │
 │               │──POST /generate────▶│
 │               │                     │──Deserialize
 │               │                     │──Generate MD
 │               │◀──200 OK (JSON)─────│
 │               │                     │
 │◀──Display MD──│                     │
 │               │                     │
 │──Download────▶│                     │
 │               │                     │
```

### Request/Response Example

**Request:**
```json
{
  "purpose": {
    "use_case": "Customer support chatbot",
    "user_needs": ["24/7 availability", "FAQ handling"],
    "success_criteria": "90% resolution rate"
  },
  ...
}
```

**Response:**
```json
{
  "markdown": "# AI System Design Specification\n\n## 1. Purpose & Scope\n..."
}
```

## Related Documentation

- [Data Flow](data-flow.md) - Detailed data lifecycle
- [Architecture](architecture.md) - System structure
- [Integration](integration.md) - Web/Desktop modes
