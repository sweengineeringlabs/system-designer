# Data Flow Specification

## Overview
This document outlines the lifecycle of data within the System Designer Agent, tracing the path from user input in the React frontend to the generated Markdown specification returned by the Rust backend.

## Data Lifecycle

### 1. Input Collection (Frontend)
- **Source:** User interaction with the Multi-Step Wizard.
- **State Management:** React `useState` holds a complex object (`formData`) mirroring the 8-step framework structure.
- **Validation:** Basic client-side validation (e.g., ensuring required fields are non-empty before final submission).

### 2. Data Transformation (Frontend)
Before transmission, the frontend pre-processes the raw state:
- **String Splitting:** Comma-separated strings (e.g., "Stripe, Twilio") are split into JSON arrays (`["Stripe", "Twilio"]`).
- **Trimming:** Whitespace is removed from array elements.
- **Type Casting:** Boolean toggles (e.g., for Memory settings) are ensured to be strict `true/false` values.

### 3. Transmission (HTTP)
- **Protocol:** HTTP/1.1
- **Method:** `POST`
- **Endpoint:** `http://localhost:3000/generate`
- **Payload:** JSON Object matching the `DesignRequest` Rust struct.
- **Headers:** `Content-Type: application/json`

### 4. Processing (Backend)
- **Deserialization:** `serde_json` parses the incoming body into the strictly typed `DesignRequest` struct.
- **Logic:** The backend logic is stateless. It maps the struct fields into a pre-defined Rust formatted string literal (`format!`).
- **Formatting:** No complex logic or AI inference is performed; this is a deterministic template engine.

### 5. Response & Presentation
- **Serialization:** The generated Markdown string is wrapped in a `DesignResponse` struct and serialized to JSON.
- **Rendering:** The frontend receives the JSON, extracts the `markdown` string, and renders it in a styled `<pre>` block for the user to copy or download.
