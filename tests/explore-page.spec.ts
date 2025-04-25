import { test, expect } from '@playwright/test';

test('Explore page displays listings', async ({ page }) => {
  await page.goto('https://uh-marketplace-app.vercel.app/explore');
  const listingCount = await page.locator('.listing-card').count();
  expect(listingCount).toBeGreaterThan(0);
});
