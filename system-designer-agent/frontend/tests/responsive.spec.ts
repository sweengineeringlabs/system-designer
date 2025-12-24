import { test, expect } from '@playwright/test';

test.describe('Mobile Responsiveness', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE

  test('wizard renders on mobile', async ({ page }) => {
    await page.goto('/');

    // Main content should be visible
    await expect(page.getByRole('heading', { name: 'Purpose & Scope' })).toBeVisible();

    // Phase indicator should be visible
    await expect(page.getByText('Phase 1')).toBeVisible();
  });

  test('form inputs are usable on mobile', async ({ page }) => {
    await page.goto('/');

    // Inputs should be visible and fillable
    const input = page.getByPlaceholder('e.g. Enterprise Knowledge Base');
    await expect(input).toBeVisible();
    await input.fill('Mobile Test');
    await expect(input).toHaveValue('Mobile Test');
  });

  test('navigation buttons work on mobile', async ({ page }) => {
    await page.goto('/');

    // Next button should be visible and clickable
    const nextButton = page.getByRole('button', { name: /next step/i });
    await expect(nextButton).toBeVisible();
    await nextButton.click();

    await expect(page.getByRole('heading', { name: 'System Prompt Design' })).toBeVisible();

    // Back button should work
    const backButton = page.getByRole('button', { name: /previous/ });
    await backButton.click();

    await expect(page.getByRole('heading', { name: 'Purpose & Scope' })).toBeVisible();
  });

  test('completes full wizard flow on mobile', async ({ page }) => {
    await page.route('**/generate', async route => {
      await route.fulfill({ json: { markdown: '# Mobile Generated' } });
    });

    await page.goto('/');

    // Navigate through all steps
    for (let i = 0; i < 7; i++) {
      await page.getByRole('button', { name: /next step/i }).click();
    }

    // Finish
    await page.getByRole('button', { name: /finish.*generate/i }).click();

    // Result should be visible
    await expect(page.getByRole('heading', { name: 'Architecture Ready' })).toBeVisible();
  });
});

test.describe('Tablet Responsiveness', () => {
  test.use({ viewport: { width: 768, height: 1024 } }); // iPad

  test('wizard renders on tablet', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Purpose & Scope' })).toBeVisible();
    await expect(page.getByText('Phase 1')).toBeVisible();
  });

  test('form layout works on tablet', async ({ page }) => {
    await page.goto('/');

    // Step 1 inputs should be visible
    const useCaseInput = page.getByPlaceholder('e.g. Enterprise Knowledge Base');
    const successInput = page.getByPlaceholder('e.g. < 2s Latency');

    await expect(useCaseInput).toBeVisible();
    await expect(successInput).toBeVisible();
  });
});

test.describe('Desktop Responsiveness', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('full layout visible on desktop', async ({ page }) => {
    await page.goto('/');

    // Sidebar should be visible
    const sidebar = page.locator('nav[aria-label="Wizard steps"]');
    await expect(sidebar).toBeVisible();

    // Step names in sidebar
    await expect(sidebar.getByText('Purpose & Scope')).toBeVisible();
    await expect(sidebar.getByText('System Prompt Design')).toBeVisible();
    await expect(sidebar.getByText('Choose LLM')).toBeVisible();
  });

  test('session date visible in sidebar', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('Session Date')).toBeVisible();
  });
});

test.describe('Viewport Transitions', () => {
  test('layout adapts when viewport changes', async ({ page }) => {
    await page.goto('/');

    // Start at desktop
    await page.setViewportSize({ width: 1440, height: 900 });
    const sidebar = page.locator('nav[aria-label="Wizard steps"]');
    await expect(sidebar).toBeVisible();

    // Resize to mobile
    await page.setViewportSize({ width: 375, height: 667 });

    // Main content should still be visible
    await expect(page.getByRole('heading', { name: 'Purpose & Scope' })).toBeVisible();

    // Navigation should still work
    await page.getByRole('button', { name: /next step/i }).click();
    await expect(page.getByRole('heading', { name: 'System Prompt Design' })).toBeVisible();
  });
});

test.describe('Touch Interactions', () => {
  test.use({ hasTouch: true, viewport: { width: 375, height: 667 } });

  test('buttons respond to touch', async ({ page }) => {
    await page.goto('/');

    // Tap next button
    const nextButton = page.getByRole('button', { name: /next step/i });
    await nextButton.tap();

    await expect(page.getByRole('heading', { name: 'System Prompt Design' })).toBeVisible();
  });

  test('form inputs work with touch', async ({ page }) => {
    await page.goto('/');

    // Tap on input to focus
    const input = page.getByPlaceholder('e.g. Enterprise Knowledge Base');
    await input.tap();
    await input.fill('Touch Input Test');

    await expect(input).toHaveValue('Touch Input Test');
  });

  test('checkboxes toggle with touch', async ({ page }) => {
    await page.goto('/');

    // Navigate to Memory step
    for (let i = 0; i < 4; i++) {
      await page.getByRole('button', { name: /next step/i }).tap();
    }

    // Tap checkbox card
    const checkboxCard = page.locator('text=Enable conversational history memory');
    await checkboxCard.tap();

    const checkbox = page.locator('input[type="checkbox"]').first();
    await expect(checkbox).not.toBeChecked();
  });
});
