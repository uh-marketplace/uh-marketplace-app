import { test, expect } from '@playwright/test';

test.use({
  storageState: 'john-auth.json',
});

test('test', async ({ page }) => {
  await page.goto('https://uh-marketplace-app.vercel.app/explore');
  await page.getByRole('link', { name: 'UH Marketplace Logo UH' }).click();
  await page.getByRole('link', { name: 'Add' }).click();
  await page.getByRole('link', { name: 'Explore' }).click();
  await page.getByRole('link', { name: 'Favorites' }).click();
  await page.getByRole('link', { name: 'Sign In' }).click();
  await expect(page.getByRole('heading', { name: 'Today\'s Picks' })).toBeVisible();
  await expect(page.getByRole('main').nth(1)).toBeVisible();
  await expect(page.getByRole('contentinfo')).toBeVisible();
  await expect(page.getByRole('navigation')).toBeVisible();
});
