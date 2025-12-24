import { test, expect } from '@playwright/test';

test('full system design wizard flow', async ({ page }) => {
  // Mock the backend API
  await page.route('**/generate', async route => {
    await new Promise(r => setTimeout(r, 300));
    const json = {
      markdown: '# Mock Generated Design\n\n## 1. Purpose\n- **Use Case:** Test Bot'
    };
    await route.fulfill({ json });
  });

  await page.goto('/');

  // Step 1: Purpose
  await expect(page.getByRole('heading', { name: 'Purpose & Scope' })).toBeVisible();
  await page.getByPlaceholder('e.g. Enterprise Knowledge Base').fill('Test Bot');
  await page.getByRole('button', { name: /next step/i }).click();

  // Step 2: Prompt
  await expect(page.getByRole('heading', { name: 'System Prompt Design' })).toBeVisible();
  await page.getByPlaceholder('Who is this agent?').fill('Test Persona');
  await page.getByRole('button', { name: /next step/i }).click();

  // Step 3: Model
  await expect(page.getByRole('heading', { name: 'Choose LLM' })).toBeVisible();
  await page.getByPlaceholder('Claude 3.5, GPT-4o...').fill('GPT-4');
  await page.getByRole('button', { name: /next step/i }).click();

  // Step 4: Tools
  await expect(page.getByRole('heading', { name: 'Tools & Integrations' })).toBeVisible();
  await page.getByPlaceholder('Stripe, Twilio, Slack (comma separated)').fill('Stripe');
  await page.getByRole('button', { name: /next step/i }).click();

  // Step 5: Memory
  await expect(page.getByRole('heading', { name: 'Memory Systems' })).toBeVisible();
  await page.getByRole('button', { name: /next step/i }).click();

  // Step 6: Orchestration
  await expect(page.getByRole('heading', { name: 'Orchestration' })).toBeVisible();
  await page.getByPlaceholder('Router, Sequential, Graph-based...').fill('Router');
  await page.getByRole('button', { name: /next step/i }).click();

  // Step 7: Interface
  await expect(page.getByRole('heading', { name: 'User Interface' })).toBeVisible();
  await page.getByPlaceholder('Web App, CLI, Slack Bot...').fill('Web');
  await page.getByRole('button', { name: /next step/i }).click();

  // Step 8: Testing
  await expect(page.getByRole('heading', { name: 'Testing & Evals' })).toBeVisible();
  await page.getByPlaceholder('e.g. Identity check, Tool failure (comma separated)').fill('Unit Tests');

  // Finish
  await page.getByRole('button', { name: /finish.*generate/i }).click();

  // Assert Result
  await expect(page.getByRole('heading', { name: 'Architecture Ready' })).toBeVisible();
  await expect(page.getByText('# Mock Generated Design')).toBeVisible();
});
