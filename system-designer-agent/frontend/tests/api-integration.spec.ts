import { test, expect } from '@playwright/test';

/**
 * API Integration Tests
 * Uses mocked responses for reliability.
 */

test.describe('API Integration', () => {
  test('sends correct request payload structure', async ({ page }) => {
    let capturedPayload: any;

    await page.route('**/generate', async route => {
      capturedPayload = route.request().postDataJSON();
      await route.fulfill({ json: { markdown: '# Success' } });
    });

    await page.goto('/');

    // Fill step 1
    await page.getByPlaceholder('e.g. Enterprise Knowledge Base').fill('Test Bot');
    await page.getByPlaceholder('e.g. < 2s Latency').fill('99% uptime');

    // Navigate through all steps
    for (let i = 0; i < 7; i++) {
      await page.getByRole('button', { name: /next step/i }).click();
    }

    await page.getByRole('button', { name: /finish.*generate/i }).click();

    // Wait for result
    await expect(page.getByRole('heading', { name: 'Architecture Ready' })).toBeVisible();

    // Verify payload structure
    expect(capturedPayload).toBeDefined();
    expect(capturedPayload).toHaveProperty('purpose');
    expect(capturedPayload).toHaveProperty('prompt');
    expect(capturedPayload).toHaveProperty('model');
    expect(capturedPayload).toHaveProperty('tools');
    expect(capturedPayload).toHaveProperty('memory');
    expect(capturedPayload).toHaveProperty('orchestration');
    expect(capturedPayload).toHaveProperty('interface');
    expect(capturedPayload).toHaveProperty('testing');

    // Verify specific fields
    expect(capturedPayload.purpose.use_case).toBe('Test Bot');
  });

  test('transforms comma-separated strings to arrays', async ({ page }) => {
    let capturedPayload: any;

    await page.route('**/generate', async route => {
      capturedPayload = route.request().postDataJSON();
      await route.fulfill({ json: { markdown: '# Success' } });
    });

    await page.goto('/');

    // Navigate to Tools step (step 4)
    for (let i = 0; i < 3; i++) {
      await page.getByRole('button', { name: /next step/i }).click();
    }

    // Fill with comma-separated values
    await page.getByPlaceholder('Stripe, Twilio, Slack (comma separated)').fill('Stripe, Twilio, Slack');

    // Complete wizard
    for (let i = 0; i < 4; i++) {
      await page.getByRole('button', { name: /next step/i }).click();
    }
    await page.getByRole('button', { name: /finish.*generate/i }).click();

    await expect(page.getByRole('heading', { name: 'Architecture Ready' })).toBeVisible();

    // Verify arrays are properly formed
    expect(capturedPayload.tools.apis).toEqual(['Stripe', 'Twilio', 'Slack']);
  });

  test('sends boolean values for memory toggles', async ({ page }) => {
    let capturedPayload: any;

    await page.route('**/generate', async route => {
      capturedPayload = route.request().postDataJSON();
      await route.fulfill({ json: { markdown: '# Success' } });
    });

    await page.goto('/');

    // Navigate to Memory step
    for (let i = 0; i < 4; i++) {
      await page.getByRole('button', { name: /next step/i }).click();
    }

    // Toggle episodic off
    await page.locator('text=Enable conversational history memory').click();

    // Complete wizard
    for (let i = 0; i < 3; i++) {
      await page.getByRole('button', { name: /next step/i }).click();
    }
    await page.getByRole('button', { name: /finish.*generate/i }).click();

    await expect(page.getByRole('heading', { name: 'Architecture Ready' })).toBeVisible();

    // Verify boolean types
    expect(typeof capturedPayload.memory.episodic).toBe('boolean');
    expect(capturedPayload.memory.episodic).toBe(false);
  });

  test('displays generated markdown in result view', async ({ page }) => {
    const mockMarkdown = '# System Design Specification\n\nTest content here';

    await page.route('**/generate', async route => {
      await route.fulfill({ json: { markdown: mockMarkdown } });
    });

    await page.goto('/');

    for (let i = 0; i < 7; i++) {
      await page.getByRole('button', { name: /next step/i }).click();
    }
    await page.getByRole('button', { name: /finish.*generate/i }).click();

    // Verify markdown is displayed
    await expect(page.getByText('# System Design Specification')).toBeVisible();
  });

  test('shows loading state during API call', async ({ page }) => {
    await page.route('**/generate', async route => {
      await new Promise(r => setTimeout(r, 1000));
      await route.fulfill({ json: { markdown: '# Done' } });
    });

    await page.goto('/');

    for (let i = 0; i < 7; i++) {
      await page.getByRole('button', { name: /next step/i }).click();
    }

    // Click generate
    await page.getByRole('button', { name: /finish.*generate/i }).click();

    // Should show loading state
    await expect(page.getByText('Processing...')).toBeVisible();

    // Wait for completion
    await expect(page.getByRole('heading', { name: 'Architecture Ready' })).toBeVisible();
  });
});

test.describe('API Error Handling', () => {
  test('handles server error gracefully', async ({ page }) => {
    await page.route('**/generate', async route => {
      await route.fulfill({ status: 500, body: 'Server Error' });
    });

    await page.goto('/');

    for (let i = 0; i < 7; i++) {
      await page.getByRole('button', { name: /next step/i }).click();
    }
    await page.getByRole('button', { name: /finish.*generate/i }).click();

    // Should stay on wizard, not show result
    await expect(page.getByRole('heading', { name: 'Testing & Evals' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Architecture Ready' })).not.toBeVisible();
  });

  test('handles network error gracefully', async ({ page }) => {
    await page.route('**/generate', async route => {
      await route.abort('connectionrefused');
    });

    await page.goto('/');

    for (let i = 0; i < 7; i++) {
      await page.getByRole('button', { name: /next step/i }).click();
    }
    await page.getByRole('button', { name: /finish.*generate/i }).click();

    // Should stay on wizard
    await expect(page.getByRole('heading', { name: 'Testing & Evals' })).toBeVisible();
  });
});

test.describe('Download Functionality', () => {
  test('downloads markdown file with correct name', async ({ page }) => {
    await page.route('**/generate', async route => {
      await route.fulfill({ json: { markdown: '# Design Spec\n\nContent here' } });
    });

    await page.goto('/');

    for (let i = 0; i < 7; i++) {
      await page.getByRole('button', { name: /next step/i }).click();
    }
    await page.getByRole('button', { name: /finish.*generate/i }).click();

    await expect(page.getByRole('heading', { name: 'Architecture Ready' })).toBeVisible();

    // Capture download
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /download/i }).click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toBe('DESIGN_SPEC.md');
  });
});

test.describe('Start Over Functionality', () => {
  test('start over returns to wizard view', async ({ page }) => {
    await page.route('**/generate', async route => {
      await route.fulfill({ json: { markdown: '# Result' } });
    });

    await page.goto('/');

    for (let i = 0; i < 7; i++) {
      await page.getByRole('button', { name: /next step/i }).click();
    }
    await page.getByRole('button', { name: /finish.*generate/i }).click();

    await expect(page.getByRole('heading', { name: 'Architecture Ready' })).toBeVisible();

    // Click Start Over
    await page.getByRole('button', { name: /start over/i }).click();

    // Should return to wizard
    await expect(page.getByRole('button', { name: /finish.*generate/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Architecture Ready' })).not.toBeVisible();
  });

  test('can generate again after start over', async ({ page }) => {
    let callCount = 0;

    await page.route('**/generate', async route => {
      callCount++;
      await route.fulfill({ json: { markdown: `# Result ${callCount}` } });
    });

    await page.goto('/');

    // First generation
    for (let i = 0; i < 7; i++) {
      await page.getByRole('button', { name: /next step/i }).click();
    }
    await page.getByRole('button', { name: /finish.*generate/i }).click();
    await expect(page.getByText('# Result 1')).toBeVisible();

    // Start over
    await page.getByRole('button', { name: /start over/i }).click();

    // Second generation
    await page.getByRole('button', { name: /finish.*generate/i }).click();
    await expect(page.getByText('# Result 2')).toBeVisible();

    expect(callCount).toBe(2);
  });
});
