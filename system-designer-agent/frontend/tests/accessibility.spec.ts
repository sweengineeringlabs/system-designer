import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page has proper heading hierarchy', async ({ page }) => {
    // Main heading (h1) - Architect
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();

    // Step heading (h2)
    const h2 = page.getByRole('heading', { level: 2 });
    await expect(h2.first()).toBeVisible();
  });

  test('navigation has proper ARIA labels', async ({ page }) => {
    const nav = page.locator('nav[aria-label="Wizard steps"]');
    await expect(nav).toBeVisible();

    // Steps list has proper role
    const stepsList = nav.locator('ol[role="list"]');
    await expect(stepsList).toBeVisible();
  });

  test('current step has aria-current attribute', async ({ page }) => {
    const currentStep = page.locator('li[aria-current="step"]');
    await expect(currentStep).toBeVisible();

    // Navigate and check aria-current updates
    await page.getByRole('button', { name: /next step/i }).click();
    await expect(page.locator('li[aria-current="step"]')).toContainText('System Prompt');
  });

  test('buttons have aria-labels', async ({ page }) => {
    // Back button
    const backButton = page.getByRole('button', { name: /previous/ });
    await expect(backButton).toBeVisible();

    // Next button
    const nextButton = page.getByRole('button', { name: /next step/i });
    await expect(nextButton).toBeVisible();
  });

  test('form inputs are accessible', async ({ page }) => {
    // Check that inputs are visible and usable
    const useCaseInput = page.getByPlaceholder('e.g. Enterprise Knowledge Base');
    await expect(useCaseInput).toBeVisible();

    // Label should be visible
    await expect(page.getByText('Use Case')).toBeVisible();
  });

  test('icons are hidden from screen readers', async ({ page }) => {
    // Icons should have aria-hidden="true"
    const icons = page.locator('[aria-hidden="true"]');
    const count = await icons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('main content area has proper role', async ({ page }) => {
    const main = page.locator('main[role="main"]');
    await expect(main).toBeVisible();
  });

  test('keyboard navigation works', async ({ page }) => {
    // Tab through interactive elements
    await page.keyboard.press('Tab');

    // Should be able to focus on elements
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('checkbox cards are accessible', async ({ page }) => {
    // Navigate to Memory step
    for (let i = 0; i < 4; i++) {
      await page.getByRole('button', { name: /next step/i }).click();
    }

    // Memory options group has aria-label
    const memoryGroup = page.locator('[role="group"][aria-label="Memory options"]');
    await expect(memoryGroup).toBeVisible();

    // Checkboxes should be visible
    const checkbox = page.locator('input[type="checkbox"]').first();
    await expect(checkbox).toBeVisible();
  });
});

test.describe('Result View Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    // Mock success response
    await page.route('**/generate', async route => {
      await route.fulfill({ json: { markdown: '# Test Result\n\nContent here' } });
    });
  });

  test('result view has proper structure', async ({ page }) => {
    await page.goto('/');

    // Navigate to end
    for (let i = 0; i < 7; i++) {
      await page.getByRole('button', { name: /next step/i }).click();
    }
    await page.getByRole('button', { name: /finish.*generate/i }).click();

    // Result heading should be visible
    await expect(page.getByRole('heading', { name: 'Architecture Ready' })).toBeVisible();

    // Result should be in a region
    const resultRegion = page.locator('[role="region"]');
    await expect(resultRegion).toBeVisible();
  });

  test('action buttons are accessible', async ({ page }) => {
    await page.goto('/');

    for (let i = 0; i < 7; i++) {
      await page.getByRole('button', { name: /next step/i }).click();
    }
    await page.getByRole('button', { name: /finish.*generate/i }).click();

    // Download button
    await expect(page.getByRole('button', { name: /download/i })).toBeVisible();

    // Start Over button
    await expect(page.getByRole('button', { name: /start over/i })).toBeVisible();
  });
});
