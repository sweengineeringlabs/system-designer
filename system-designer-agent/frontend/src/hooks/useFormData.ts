import { useState, useCallback } from 'react';
import type { FormData, FormSection } from '@/types';

const initialFormData: FormData = {
  purpose: { use_case: '', user_needs: '', success_criteria: '', constraints: '' },
  prompt: { goals: '', role: '', instructions: '', guardrails: '' },
  model: { base_model: '', parameters: '', context_window: '', cost_latency_tradeoff: '' },
  tools: { apis: '', mcp_servers: '', custom_functions: '' },
  memory: { episodic: true, working_memory: true, vector_db: '', sql_db: '', file_storage: '' },
  orchestration: { workflow: '', triggers: '', error_handling: '', message_queues: '' },
  interface: { platform: '', interaction_mode: '', api_endpoint: '' },
  testing: { unit_tests: '', latency_testing: '', quality_metrics: '', evals: '' },
};

export function useFormData() {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const updateField = useCallback(<S extends FormSection>(
    section: S,
    field: keyof FormData[S],
    value: FormData[S][typeof field]
  ) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
  }, []);

  return {
    formData,
    updateField,
    resetForm,
  };
}
