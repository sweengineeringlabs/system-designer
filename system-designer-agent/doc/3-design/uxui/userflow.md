# User Interaction Flow

This document details the user's journey through the System Designer Agent interface.

```mermaid
graph TD
    A[Start Application] --> B[Step 1: Purpose & Scope]
    
    subgraph "Wizard Phase (Steps 1-8)"
        B -->|Input Data| B1[Validate Inputs]
        B1 -->|Next| C[Step 2: System Prompt]
        C -->|Next| D[Step 3: Model Selection]
        D -->|Next| E[Step 4: Tools & Integrations]
        E -->|Next| F[Step 5: Memory Systems]
        F -->|Next| G[Step 6: Orchestration]
        G -->|Next| H[Step 7: User Interface]
        H -->|Next| I[Step 8: Testing & Evals]
        
        I -->|Back| H
        H -->|Back| G
        G -->|Back| F
        F -->|Back| E
        E -->|Back| D
        D -->|Back| C
        C -->|Back| B
    end

    I -->|Finish & Generate| J{API Call}
    J -->|Loading| K[Spinner State]
    K -->|Success| L[Result View]
    K -->|Error| M[Error Alert]
    M --> I

    subgraph "Result Phase"
        L --> N[View Markdown]
        L --> O[Download .md File]
        L --> P[Start Over]
        P --> B
    end
```

## State Transitions

1.  **Initialization:** App loads, sets `currentStep = 0` (Purpose).
2.  **Navigation:** 
    - `Next`: Increments `currentStep` (if < 7).
    - `Back`: Decrements `currentStep` (if > 0).
    - Data is persisted in React state (`formData` object) across navigations.
3.  **Generation:**
    - Triggered on Step 8 "Finish".
    - Sets `loading = true`.
    - Disables buttons.
    - On response, sets `result = data.markdown` and `loading = false`.
4.  **Reset:**
    - `Start Over` clears `result` (but currently preserves `formData` for iteration).
