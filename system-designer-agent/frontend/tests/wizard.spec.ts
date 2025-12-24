import { test, expect } from '@playwright/test';

test.describe('Wizard Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays step 1 on initial load', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Purpose & Scope' })).toBeVisible();
    await expect(page.getByText('Phase 1')).toBeVisible();
  });

  test('navigates through all 8 steps', async ({ page }) => {
    const stepNames = [
      'Purpose & Scope',
      'System Prompt Design',
      'Choose LLM',
      'Tools & Integrations',
      'Memory Systems',
      'Orchestration',
      'User Interface',
      'Testing & Evals'
    ];

    for (let i = 0; i < stepNames.length; i++) {
      await expect(page.getByRole('heading', { name: stepNames[i] })).toBeVisible();
      await expect(page.getByText(`Phase ${i + 1}`)).toBeVisible();

      if (i < stepNames.length - 1) {
        await page.getByRole('button', { name: /next step/i }).click();
      }
    }

    // Last step should show "Finish & Generate" button
    await expect(page.getByRole('button', { name: /finish.*generate/i })).toBeVisible();
  });

  test('back button is disabled on first step', async ({ page }) => {
    const backButton = page.getByRole('button', { name: /previous/ });
    await expect(backButton).toBeDisabled();
  });

  test('back button works after navigating forward', async ({ page }) => {
    await page.getByRole('button', { name: /next step/i }).click();
    await expect(page.getByRole('heading', { name: 'System Prompt Design' })).toBeVisible();

    await page.getByRole('button', { name: /previous/ }).click();
    await expect(page.getByRole('heading', { name: 'Purpose & Scope' })).toBeVisible();
  });

  test('progress updates correctly through steps', async ({ page }) => {
    // Navigate and check phase numbers increase
    await expect(page.getByText('Phase 1')).toBeVisible();

    await page.getByRole('button', { name: /next step/i }).click();
    await expect(page.getByText('Phase 2')).toBeVisible();

    await page.getByRole('button', { name: /next step/i }).click();
    await expect(page.getByText('Phase 3')).toBeVisible();
  });

  test('sidebar highlights current step', async ({ page }) => {
    // Check first step is highlighted in sidebar
    const sidebarNav = page.locator('nav[aria-label="Wizard steps"]');
    const firstStep = sidebarNav.locator('li').first();
    await expect(firstStep).toHaveAttribute('aria-current', 'step');

    // Navigate to next step
    await page.getByRole('button', { name: /next step/i }).click();

    // Second step should now be current
    const secondStep = sidebarNav.locator('li').nth(1);
    await expect(secondStep).toHaveAttribute('aria-current', 'step');
  });
});

test.describe('Form Inputs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('step 1: purpose fields accept input', async ({ page }) => {
    await page.getByPlaceholder('e.g. Enterprise Knowledge Base').fill('Customer Support Bot');
    await page.getByPlaceholder('e.g. < 2s Latency').fill('95% accuracy');
    await page.getByPlaceholder('What specific problems are we solving?').fill('24/7 support');
    await page.getByPlaceholder('Budget, Tech Stack, Regulatory requirements').fill('$50k budget');

    await expect(page.getByPlaceholder('e.g. Enterprise Knowledge Base')).toHaveValue('Customer Support Bot');
    await expect(page.getByPlaceholder('e.g. < 2s Latency')).toHaveValue('95% accuracy');
  });

  test('step 2: prompt design fields accept input', async ({ page }) => {
    await page.getByRole('button', { name: /next step/i }).click();

    await page.getByPlaceholder('Who is this agent?').fill('Support Agent');
    await page.getByPlaceholder('What should it achieve?').fill('Resolve tickets');
    await page.getByPlaceholder('Detailed behavioral logic...').fill('Be helpful');
    await page.getByPlaceholder('What should it NEVER do?').fill('Share PII');

    await expect(page.getByPlaceholder('Who is this agent?')).toHaveValue('Support Agent');
  });

  test('step 3: LLM config fields accept input', async ({ page }) => {
    for (let i = 0; i < 2; i++) {
      await page.getByRole('button', { name: /next step/i }).click();
    }

    await page.getByPlaceholder('Claude 3.5, GPT-4o...').fill('Claude 3.5 Sonnet');
    await page.getByPlaceholder('128k, 200k...').fill('200k');
    await page.getByPlaceholder('Temp: 0.7, Top-P: 0.9').fill('Temp: 0.3');

    await expect(page.getByPlaceholder('Claude 3.5, GPT-4o...')).toHaveValue('Claude 3.5 Sonnet');
  });

  test('step 5: memory checkboxes toggle correctly', async ({ page }) => {
    // Navigate to Memory step (step 5)
    for (let i = 0; i < 4; i++) {
      await page.getByRole('button', { name: /next step/i }).click();
    }

    await expect(page.getByRole('heading', { name: 'Memory Systems' })).toBeVisible();

    // Get checkboxes by their container text
    const episodicCard = page.locator('text=Enable conversational history memory');

    // Click to toggle off
    await episodicCard.click();

    // Verify checkbox state changed
    const episodicCheckbox = page.locator('input[type="checkbox"]').first();
    await expect(episodicCheckbox).not.toBeChecked();

    // Toggle back on
    await episodicCard.click();
    await expect(episodicCheckbox).toBeChecked();
  });
});

test.describe('Form State Persistence', () => {
  test('preserves data when navigating between steps', async ({ page }) => {
    await page.goto('/');

    // Fill step 1
    const testValue = 'Persistence Test Bot';
    await page.getByPlaceholder('e.g. Enterprise Knowledge Base').fill(testValue);

    // Navigate forward and back
    await page.getByRole('button', { name: /next step/i }).click();
    await page.getByRole('button', { name: /previous/ }).click();

    // Verify data persists
    await expect(page.getByPlaceholder('e.g. Enterprise Knowledge Base')).toHaveValue(testValue);
  });

  test('preserves data across multiple steps', async ({ page }) => {
    await page.goto('/');

    // Fill multiple steps
    const step1Value = 'Step 1 Data';
    await page.getByPlaceholder('e.g. Enterprise Knowledge Base').fill(step1Value);
    await page.getByRole('button', { name: /next step/i }).click();

    const step2Value = 'Step 2 Data';
    await page.getByPlaceholder('Who is this agent?').fill(step2Value);
    await page.getByRole('button', { name: /next step/i }).click();

    const step3Value = 'Claude 3.5';
    await page.getByPlaceholder('Claude 3.5, GPT-4o...').fill(step3Value);

    // Go back to step 1
    await page.getByRole('button', { name: /previous/ }).click();
    await page.getByRole('button', { name: /previous/ }).click();

    // Verify step 1 data
    await expect(page.getByPlaceholder('e.g. Enterprise Knowledge Base')).toHaveValue(step1Value);

    // Go forward and verify step 2 data
    await page.getByRole('button', { name: /next step/i }).click();
    await expect(page.getByPlaceholder('Who is this agent?')).toHaveValue(step2Value);

    // Verify step 3 data
    await page.getByRole('button', { name: /next step/i }).click();
    await expect(page.getByPlaceholder('Claude 3.5, GPT-4o...')).toHaveValue(step3Value);
  });
});
