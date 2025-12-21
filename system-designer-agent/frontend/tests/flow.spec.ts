import { test, expect } from '@playwright/test';

test('full system design wizard flow', async ({ page }) => {
  // Mock the backend API to ensure test stability without running Rust server
  // Remove this block to test against real backend
  await page.route('http://localhost:3000/generate', async route => {
    // Simulate network delay
    await new Promise(r => setTimeout(r, 500));
    const json = {
      markdown: '# Mock Generated Design\n\n## 1. Purpose\n- **Use Case:** Test Bot'
    };
    await route.fulfill({ json });
  });

  await page.goto('/');

  // Step 1: Purpose
  await expect(page.getByText('Purpose & Scope', { exact: false })).toBeVisible();
  await page.getByPlaceholder('e.g. Enterprise Knowledge Base').fill('Test Bot');
  await page.getByRole('button', { name: 'Next Step' }).click();

  // Step 2: Prompt
  await expect(page.getByText('System Prompt Design', { exact: false })).toBeVisible();
  await page.getByPlaceholder('Who is this agent?').fill('Test Persona');
  await page.getByRole('button', { name: 'Next Step' }).click();

  // Step 3: Model
  await expect(page.getByText('Choose LLM', { exact: false })).toBeVisible();
  await page.getByPlaceholder('Claude 3.5, GPT-4o...').fill('GPT-4');
  await page.getByRole('button', { name: 'Next Step' }).click();

  // Step 4: Tools
  await expect(page.getByText('Tools & Integrations', { exact: false })).toBeVisible();
  await page.getByPlaceholder('Stripe, Twilio, Slack (comma separated)').fill('Stripe');
  await page.getByRole('button', { name: 'Next Step' }).click();

  // Step 5: Memory
  await expect(page.getByText('Memory Systems', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Next Step' }).click();

  // Step 6: Orchestration
  await expect(page.getByText('Orchestration', { exact: false })).toBeVisible();
  await page.getByPlaceholder('Router, Sequential, Graph-based...').fill('Router');
  await page.getByRole('button', { name: 'Next Step' }).click();

  // Step 7: Interface
  await expect(page.getByText('User Interface', { exact: false })).toBeVisible();
  await page.getByPlaceholder('Web App, CLI, Slack Bot...').fill('Web');
  await page.getByRole('button', { name: 'Next Step' }).click();

  // Step 8: Testing
  await expect(page.getByText('Testing & Evals', { exact: false })).toBeVisible();
  await page.getByPlaceholder('e.g. Identity check, Tool failure (comma separated)').fill('Unit Tests');
  
  // Finish
  await page.getByRole('button', { name: 'Finish & Generate' }).click();

  // Assert Result
  await expect(page.getByText('Architecture Ready')).toBeVisible();
  await expect(page.getByText('# Mock Generated Design')).toBeVisible();
});
