import { test, expect } from '@playwright/test';

test.use({
  storageState: 'john-auth.json',
});

test('test', async ({ page }) => {
  await expect(page.locator('div').filter({ hasText: 'Sign InEmailPasswordSigninDon' }).nth(2)).toBeVisible();
  await expect(page.locator('div').filter({ hasText: /^EmailPasswordSignin$/ })).toBeVisible();
  await expect(page.getByText('Don\'t have an account?Sign up')).toBeVisible();
  await page.getByRole('button', { name: 'Signin' }).click();
  await page.locator('input[name="email"]').click();
  await page.locator('input[name="password"]').click();
  await page.getByRole('link', { name: 'UH Marketplace Logo UH' }).click();
  await expect(page.getByRole('navigation')).toBeVisible();
  await expect(page.getByRole('contentinfo')).toBeVisible();
  await page.getByRole('link', { name: 'Add' }).click();
  await page.getByRole('link', { name: 'Explore' }).click();
  await page.getByRole('link', { name: 'Favorites' }).click();
  await page.getByRole('link', { name: 'Sign In' }).click();
});
