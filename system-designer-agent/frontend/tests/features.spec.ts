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
    await page.getByRole('button', { name: 'Next Step' }).click();
    await expect(page.getByText('System Prompt Design')).toBeVisible();
    
    // 3. Go Back
    await page.getByRole('button', { name: 'Back' }).click();
    await expect(page.getByText('Purpose & Scope')).toBeVisible();
    
    // 4. Verify Data is still there
    await expect(page.getByPlaceholder('e.g. Enterprise Knowledge Base')).toHaveValue(testInput);
  });

  test('memory toggles work correctly', async ({ page }) => {
    // Navigate to Step 5 (Memory)
    // 0->1->2->3->4 (4 clicks)
    for (let i = 0; i < 4; i++) {
        await page.getByRole('button', { name: 'Next Step' }).click();
    }
    
    await expect(page.getByText('Memory Systems')).toBeVisible();

    // Toggle Episodic (Default is true, click to false)
    const episodicCheckbox = page.locator('input[type="checkbox"]').first();
    // Note: Our UI uses a div wrapper with an onClick, but the checkbox input reflects state
    // We click the visible text/container
    await page.getByText('Enable conversational history memory').click();
    expect(await episodicCheckbox.isChecked()).toBeFalsy();

    // Toggle back on
    await page.getByText('Enable conversational history memory').click();
    expect(await episodicCheckbox.isChecked()).toBeTruthy();
  });

  test('handles backend errors gracefully', async ({ page }) => {
    // Mock a 500 Error
    await page.route('http://localhost:3000/generate', async route => {
      await route.fulfill({ status: 500, body: 'Internal Server Error' });
    });

    // Fast forward to end
    for (let i = 0; i < 7; i++) {
        await page.getByRole('button', { name: 'Next Step' }).click();
    }

    // Handle the browser alert dialog
    page.on('dialog', async dialog => {
        expect(dialog.message()).toContain('Failed to generate design');
        await dialog.accept();
    });

    await page.getByRole('button', { name: 'Finish & Generate' }).click();
    
    // Should still be on the wizard screen (Testing step), not the result screen
    await expect(page.getByText('Testing & Evals')).toBeVisible();
  });

  test('start over resets the view', async ({ page }) => {
     // Mock Success
     await page.route('http://localhost:3000/generate', async route => {
        await route.fulfill({ json: { markdown: '# Done' } });
      });

    // Fast forward and finish
    for (let i = 0; i < 7; i++) {
        await page.getByRole('button', { name: 'Next Step' }).click();
    }
    await page.getByRole('button', { name: 'Finish & Generate' }).click();

    // Verify Result Screen
    await expect(page.getByText('Architecture Ready')).toBeVisible();

    // Click Start Over
    await page.getByRole('button', { name: 'Start Over' }).click();

    // Should return to Wizard (preserves state in current implementation, but view changes)
    await expect(page.getByText('Testing & Evals')).toBeVisible(); // Returns to last step or first? Logic says simply hides result.
    // In App.jsx, `setResult(null)` just unmounts result view. The step state remains at the end (Step 8) or whatever it was.
    // Let's verify we are back in the wizard.
    await expect(page.getByRole('button', { name: 'Finish & Generate' })).toBeVisible();
  });

  test('sends correct payload format (arrays & types)', async ({ page }) => {
    // Fill out a field that requires transformation (comma separated string -> array)
    // Navigate to Tools (Step 4: index 3)
    for (let i = 0; i < 3; i++) { await page.getByRole('button', { name: 'Next Step' }).click(); }
    
    await page.getByPlaceholder('Stripe, Twilio, Slack (comma separated)').fill('  Stripe,  Twilio  ');
    
    // Fast forward to finish
    for (let i = 0; i < 4; i++) { await page.getByRole('button', { name: 'Next Step' }).click(); }

    // Intercept request to verify payload
    let requestPayload: any;
    await page.route('http://localhost:3000/generate', async route => {
        requestPayload = route.request().postDataJSON();
        await route.fulfill({ json: { markdown: '# Success' } });
    });

    await page.getByRole('button', { name: 'Finish & Generate' }).click();

    // Assertions
    expect(requestPayload).toBeDefined();
    // Check Array transformation and trimming
    expect(requestPayload.tools.apis).toEqual(['Stripe', 'Twilio']);
    // Check Boolean types (Memory defaults)
    expect(typeof requestPayload.memory.episodic).toBe('boolean');
  });

  test('download button triggers file download', async ({ page }) => {
    // Mock Success
    await page.route('http://localhost:3000/generate', async route => {
        await route.fulfill({ json: { markdown: '# System Design Doc' } });
    });

    // Go to end
    for (let i = 0; i < 7; i++) { await page.getByRole('button', { name: 'Next Step' }).click(); }
    await page.getByRole('button', { name: 'Finish & Generate' }).click();

    // Wait for download event
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download .md' }).click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toBe('DESIGN_SPEC.md');
  });

});
