# UI Layout Specification

This document provides a low-fidelity ASCII representation of the core application layout.

## 1. Main Wizard Layout

```text
+-------------------------------------------------------------------------------+
|  [Sidebar Navigation]        |  [Main Content Area]                           |
|                              |                                                |
|  +------------------------+  |  +------------------------------------------+  |
|  | [Icon] ARCHITECT       |  |  [Header]                                   |  |
|  +------------------------+  |  PHASE 1 - SYSTEM DESIGNER                  |  |
|                              |  [Icon] Purpose & Scope           12% Done  |  |
|  [ ] 1. Purpose & Scope      |  +------------------------------------------+  |
|  [ ] 2. System Prompt        |                                                |
|  [ ] 3. Choose LLM           |  +------------------------------------------+  |
|  [ ] 4. Tools                |  |  [Input: Use Case]                       |  |
|  [ ] 5. Memory               |  |  ______________________________________  |  |
|  [ ] 6. Orchestration        |  |  | e.g. Customer Support Bot          |  |  |
|  [ ] 7. Interface            |  |  |____________________________________|  |  |
|  [ ] 8. Testing              |  |                                          |  |
|                              |  |  [TextArea: User Needs]                  |  |
|                              |  |  ______________________________________  |  |
|  Session: 2025-12-21         |  |  | Fast response, 24/7 availability...|  |  |
|                              |  |  |                                    |  |  |
|                              |  |  |____________________________________|  |  |
|                              |  +------------------------------------------+  |
|                              |                                                |
|                              |  +------------------------------------------+  |
|                              |  | [Footer]                                 |  |
|                              |  | < Back              (O) O O O O O O Next >|  |
|                              |  +------------------------------------------+  |
+------------------------------+------------------------------------------------+
```

## 2. Result View Layout

```text
+-------------------------------------------------------------------------------+
|                                                                               |
|  +-------------------------------------------------------------------------+  |
|  | [Header]                                                                |  |
|  | Architecture Ready                                     [Download .md]   |  |
|  | Your AI System Specification...                        [ Start Over ]   |  |
|  +-------------------------------------------------------------------------+  |
|                                                                               |
|  +-------------------------------------------------------------------------+  |
|  | [Markdown Preview - Dark Mode Terminal Style]                           |  |
|  |                                                                         |  |
|  |  # System Design Specification: Customer Support Bot                    |  |
|  |                                                                         |  |
|  |  ## 1. Purpose & Scope                                                  |  |
|  |  - **Use Case:** Customer Support Bot                                   |  |
|  |  - **User Needs:** Fast response...                                     |  |
|  |                                                                         |  |
|  |  ## 2. System Prompt Design                                             |  |
|  |  ...                                                                    |  |
|  |                                                                         |  |
|  +-------------------------------------------------------------------------+  |
|                                                                               |
+-------------------------------------------------------------------------------+
```

## Component Styling (Tailwind v4)

- **Sidebar:** `bg-slate-900 text-white w-72 hidden md:flex`
- **Active Step:** `bg-blue-600 text-white shadow-xl`
- **Main Container:** `bg-white rounded-[2rem] shadow-2xl max-w-5xl`
- **Inputs:** `bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500`
- **Primary Button:** `bg-blue-600 hover:bg-blue-700 text-white rounded-2xl`
