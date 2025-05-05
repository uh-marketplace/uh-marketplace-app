import { test, expect } from '@playwright/test';

test.use({
  storageState: 'john-auth.json',
});

test('test', async ({ page }) => {
  await page.getByRole('button', { name: 'Start Browsing' }).click();
  // eslint-disable-next-line max-len
  await expect(page.getByText('Buy, Sell, and Trade on CampusWelcome to UH Marketplace – a safe and easy place')).toBeVisible();
  await expect(page.locator('div').filter({ hasText: /^Search$/ })).toBeVisible();
  await expect(page.getByText('UH MarketplaceSearchProfile')).toBeVisible();
  await page.getByRole('link', { name: 'UH Marketplace Logo UH' }).click();
  await page.getByRole('searchbox', { name: 'Search' }).click();
  await page.getByRole('button', { name: 'Search' }).click();
  await page.getByRole('link', { name: 'Add' }).click();
  await page.getByRole('link', { name: 'Explore' }).click();
  await page.getByRole('link', { name: 'Favorites' }).click();
  await page.getByRole('link', { name: 'Sign In' }).click();
});
