# Data Flow Specification

**Audience**: Developers, Architects

## WHAT

This document outlines the lifecycle of data within System Designer, tracing the path from user input in the React frontend to the generated Markdown specification returned by the Rust backend.

### Scope

- Frontend data collection and transformation
- HTTP transmission protocol
- Backend processing and response

## WHY

Understanding data flow is essential for:

1. **Debugging** - Trace issues through the pipeline
2. **Extension** - Add new fields or transformations
3. **Testing** - Validate each stage independently

## HOW

### Data Lifecycle Overview

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Input     │───▶│  Transform  │───▶│   Transmit  │───▶│   Process   │
│  Collection │    │    (JSON)   │    │   (HTTP)    │    │   (Rust)    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                  │                  │                  │
       ▼                  ▼                  ▼                  ▼
   React State      JSON Arrays       POST /generate      Markdown
```

### 1. Input Collection (Frontend)

- **Source**: User interaction with the Multi-Step Wizard
- **State Management**: React `useState` holds `formData` mirroring the 8-step framework
- **Validation**: Client-side validation ensures required fields are non-empty

### 2. Data Transformation (Frontend)

Before transmission, the frontend pre-processes raw state:

| Transformation | Example |
|----------------|---------|
| String Splitting | `"Stripe, Twilio"` → `["Stripe", "Twilio"]` |
| Trimming | `" value "` → `"value"` |
| Type Casting | Toggle → strict `true/false` |

### 3. Transmission (HTTP)

| Property | Value |
|----------|-------|
| Protocol | HTTP/1.1 |
| Method | POST |
| Endpoint | `/generate` |
| Content-Type | `application/json` |
| Payload | `DesignRequest` JSON |

### 4. Processing (Backend)

- **Deserialization**: `serde_json` parses JSON into `DesignRequest` struct
- **Logic**: Stateless mapping of struct fields to Markdown template
- **Formatting**: Deterministic template engine (no AI inference)

### 5. Response & Presentation

- **Serialization**: Markdown string wrapped in `DesignResponse` JSON
- **Rendering**: Frontend displays in styled `<pre>` block
- **Download**: User can save as `DESIGN_SPEC.md`

## Related Documentation

- [Architecture](architecture.md) - System overview
- [Sequence Diagrams](sequence.md) - Interaction flows
- [Integration](integration.md) - Web/Desktop bridge
