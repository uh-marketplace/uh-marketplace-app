import { test, expect } from '@playwright/test';

test('Add Listing page has a form', async ({ page }) => {
  await page.goto('https://uh-marketplace-app.vercel.app/add');
  await expect(page.locator('form')).toBeVisible();
});
