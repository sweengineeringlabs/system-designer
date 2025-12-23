import { endpoints } from '@/config';
import type { FormData, GenerateResponse, ApiError } from '@/types';

interface GeneratePayload {
  purpose: FormData['purpose'];
  prompt: FormData['prompt'];
  model: FormData['model'];
  tools: {
    apis: string[];
    mcp_servers: string[];
    custom_functions: string;
  };
  memory: FormData['memory'];
  orchestration: FormData['orchestration'];
  interface: FormData['interface'];
  testing: {
    unit_tests: string[];
    latency_testing: string;
    quality_metrics: string;
    evals: string;
  };
}

function transformFormDataToPayload(formData: FormData): GeneratePayload {
  return {
    ...formData,
    tools: {
      ...formData.tools,
      apis: formData.tools.apis.split(',').map(s => s.trim()).filter(Boolean),
      mcp_servers: formData.tools.mcp_servers.split(',').map(s => s.trim()).filter(Boolean),
    },
    testing: {
      ...formData.testing,
      unit_tests: formData.testing.unit_tests.split(',').map(s => s.trim()).filter(Boolean),
    },
  };
}

export async function generateDesign(formData: FormData): Promise<GenerateResponse> {
  const payload = transformFormDataToPayload(formData);

  const response = await fetch(endpoints.generate, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error: ApiError = {
      message: `Failed to generate design: ${response.statusText}`,
      status: response.status,
    };
    throw error;
  }

  return response.json();
}

export function downloadMarkdown(content: string, filename = 'DESIGN_SPEC.md'): void {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
