# Core Workflows

**Audience**: Developers, Product Managers

## WHAT

This document outlines the core user and system workflows in System Designer.

## WHY

Documenting workflows:

1. **Clarifies user journeys** - Understand how users interact with the system
2. **Guides development** - Ensure features support the workflow
3. **Supports testing** - Define test scenarios from workflows

## HOW

### Primary User Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                     8-Step Design Workflow                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [Start] ──▶ Step 1 ──▶ Step 2 ──▶ Step 3 ──▶ Step 4            │
│              Purpose    Prompt     LLM       Tools               │
│                │          │         │          │                 │
│                ▼          ▼         ▼          ▼                 │
│            ──▶ Step 5 ──▶ Step 6 ──▶ Step 7 ──▶ Step 8           │
│               Memory    Orchestr.   UI        Testing            │
│                                                  │                │
│                                                  ▼                │
│                                            [Generate]             │
│                                                  │                │
│                                                  ▼                │
│                                            [Download]             │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

### Step-by-Step Flow

| Step | Action | Output |
|------|--------|--------|
| 1 | Define use case, users, success criteria | Purpose definition |
| 2 | Write system prompt, guardrails | Agent persona |
| 3 | Select model, parameters | LLM configuration |
| 4 | List APIs, tools, integrations | Capability map |
| 5 | Configure memory types | State strategy |
| 6 | Design workflow pattern | Orchestration logic |
| 7 | Choose platform, interaction mode | Deployment target |
| 8 | Define tests, metrics | Quality assurance |
| Generate | Submit all data | Markdown specification |
| Download | Save file | `DESIGN_SPEC.md` |

### Navigation Controls

Users can:
- Move forward with **Next**
- Move backward with **Previous**
- Skip to any completed step
- Reset form data

### Backend Workflow

```
Request ──▶ Validate ──▶ Deserialize ──▶ Generate ──▶ Respond
   │            │             │             │            │
   ▼            ▼             ▼             ▼            ▼
 JSON        Schema       Rust Struct   Markdown      JSON
Payload      Check       (DesignRequest)  String   (Response)
```

## Related Documentation

- [Sequence Diagrams](sequence.md) - Interaction details
- [Data Flow](data-flow.md) - Data processing
- [UX Flow](uxui/flow-sequence.md) - User experience details
