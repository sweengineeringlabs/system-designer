import type { LucideIcon } from 'lucide-react';

// Form Data Types
export interface PurposeData {
  use_case: string;
  user_needs: string;
  success_criteria: string;
  constraints: string;
}

export interface PromptData {
  goals: string;
  role: string;
  instructions: string;
  guardrails: string;
}

export interface ModelData {
  base_model: string;
  parameters: string;
  context_window: string;
  cost_latency_tradeoff: string;
}

export interface ToolsData {
  apis: string;
  mcp_servers: string;
  custom_functions: string;
}

export interface MemoryData {
  episodic: boolean;
  working_memory: boolean;
  vector_db: string;
  sql_db: string;
  file_storage: string;
}

export interface OrchestrationData {
  workflow: string;
  triggers: string;
  error_handling: string;
  message_queues: string;
}

export interface InterfaceData {
  platform: string;
  interaction_mode: string;
  api_endpoint: string;
}

export interface TestingData {
  unit_tests: string;
  latency_testing: string;
  quality_metrics: string;
  evals: string;
}

export interface FormData {
  purpose: PurposeData;
  prompt: PromptData;
  model: ModelData;
  tools: ToolsData;
  memory: MemoryData;
  orchestration: OrchestrationData;
  interface: InterfaceData;
  testing: TestingData;
}

export type FormSection = keyof FormData;

// Step Definition
export interface Step {
  id: number;
  name: string;
  icon: LucideIcon;
}

// API Types
export interface GenerateResponse {
  markdown: string;
}

export interface ApiError {
  message: string;
  status?: number;
}

// Component Props
export interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
}

export interface TextAreaProps extends InputProps {
  rows?: number;
}

export interface CheckboxCardProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

// Application State
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
