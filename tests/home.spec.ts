import { test, expect } from '@playwright/test';

test('Homepage loads correctly', async ({ page }) => {
  await page.goto('https://uh-marketplace-app.vercel.app/');
  await expect(page).toHaveTitle(/UH Marketplace/);
});
