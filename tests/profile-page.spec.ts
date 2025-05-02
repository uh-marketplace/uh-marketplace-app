import { test, expect } from '@playwright/test';

test.use({
  storageState: 'john-auth.json',
});

test('test', async ({ page }) => {
  await page.goto('https://uh-marketplace-app.vercel.app/profile');
  await page.getByRole('button', { name: 'Edit Bio' }).click();
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('button', { name: 'Edit Bio' }).click();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.getByRole('heading', { name: 'User Profile' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Details' })).toBeVisible();
  await expect(page.getByRole('navigation')).toBeVisible();
  await page.getByRole('link', { name: 'UH Marketplace Logo UH' }).click();
  await page.getByRole('button', { name: 'Search' }).click();
  await page.getByRole('link', { name: 'Add' }).click();
  await page.getByRole('link', { name: 'Explore' }).click();
  await page.getByRole('link', { name: 'Favorites' }).click();
  await page.getByRole('button', { name: 'Sign Out' }).click();
});
