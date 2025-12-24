import { test, expect } from '@playwright/test';

test.describe('Feature Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('navigation preserves form state', async ({ page }) => {
    // 1. Enter data in Step 1
    const testInput = 'Preserved Data Test';
    await page.getByPlaceholder('e.g. Enterprise Knowledge Base').fill(testInput);

    // 2. Go Next
    await page.getByRole('button', { name: /next step/i }).click();
    await expect(page.getByRole('heading', { name: 'System Prompt Design' })).toBeVisible();

    // 3. Go Back
    await page.getByRole('button', { name: /previous/ }).click();
    await expect(page.getByRole('heading', { name: 'Purpose & Scope' })).toBeVisible();

    // 4. Verify Data is still there
    await expect(page.getByPlaceholder('e.g. Enterprise Knowledge Base')).toHaveValue(testInput);
  });

  test('memory toggles work correctly', async ({ page }) => {
    // Navigate to Step 5 (Memory)
    for (let i = 0; i < 4; i++) {
      await page.getByRole('button', { name: /next step/i }).click();
    }

    await expect(page.getByRole('heading', { name: 'Memory Systems' })).toBeVisible();

    // Toggle Episodic
    const episodicCheckbox = page.locator('input[type="checkbox"]').first();
    await expect(episodicCheckbox).toBeChecked();

    await page.locator('text=Enable conversational history memory').click();
    await expect(episodicCheckbox).not.toBeChecked();

    // Toggle back on
    await page.locator('text=Enable conversational history memory').click();
    await expect(episodicCheckbox).toBeChecked();
  });

  test('handles backend errors gracefully', async ({ page }) => {
    // Mock a 500 Error
    await page.route('**/generate', async route => {
      await route.fulfill({ status: 500, body: 'Internal Server Error' });
    });

    // Navigate to end
    for (let i = 0; i < 7; i++) {
      await page.getByRole('button', { name: /next step/i }).click();
    }

    await page.getByRole('button', { name: /finish.*generate/i }).click();

    // Should still be on the wizard screen (Testing step), not the result screen
    await expect(page.getByRole('heading', { name: 'Testing & Evals' })).toBeVisible();
  });

  test('start over resets the view', async ({ page }) => {
    // Mock Success
    await page.route('**/generate', async route => {
      await route.fulfill({ json: { markdown: '# Done' } });
    });

    // Navigate and finish
    for (let i = 0; i < 7; i++) {
      await page.getByRole('button', { name: /next step/i }).click();
    }
    await page.getByRole('button', { name: /finish.*generate/i }).click();

    // Verify Result Screen
    await expect(page.getByRole('heading', { name: 'Architecture Ready' })).toBeVisible();

    // Click Start Over
    await page.getByRole('button', { name: /start over/i }).click();

    // Should return to Wizard
    await expect(page.getByRole('button', { name: /finish.*generate/i })).toBeVisible();
  });

  test('sends correct payload format (arrays & types)', async ({ page }) => {
    // Navigate to Tools (Step 4)
    for (let i = 0; i < 3; i++) {
      await page.getByRole('button', { name: /next step/i }).click();
    }

    await page.getByPlaceholder('Stripe, Twilio, Slack (comma separated)').fill('Stripe, Twilio');

    // Navigate to finish
    for (let i = 0; i < 4; i++) {
      await page.getByRole('button', { name: /next step/i }).click();
    }

    // Intercept request to verify payload
    let requestPayload: any;
    await page.route('**/generate', async route => {
      requestPayload = route.request().postDataJSON();
      await route.fulfill({ json: { markdown: '# Success' } });
    });

    await page.getByRole('button', { name: /finish.*generate/i }).click();
    await expect(page.getByRole('heading', { name: 'Architecture Ready' })).toBeVisible();

    // Assertions
    expect(requestPayload).toBeDefined();
    expect(requestPayload.tools.apis).toEqual(['Stripe', 'Twilio']);
    expect(typeof requestPayload.memory.episodic).toBe('boolean');
  });

  test('download button triggers file download', async ({ page }) => {
    // Mock Success
    await page.route('**/generate', async route => {
      await route.fulfill({ json: { markdown: '# System Design Doc' } });
    });

    // Go to end
    for (let i = 0; i < 7; i++) {
      await page.getByRole('button', { name: /next step/i }).click();
    }
    await page.getByRole('button', { name: /finish.*generate/i }).click();

    await expect(page.getByRole('heading', { name: 'Architecture Ready' })).toBeVisible();

    // Wait for download event
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /download/i }).click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toBe('DESIGN_SPEC.md');
  });
});
