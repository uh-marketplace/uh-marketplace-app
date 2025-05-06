import { test, expect } from './auth-utils';

test('test', async ({ getUserPage }) => {
  const userPage = await getUserPage('john@foo.com', 'changeme');
  await userPage.goto('https://uh-marketplace-app.vercel.app/profile');
  await userPage.getByRole('button', { name: 'Edit Bio' }).click();
  await userPage.getByRole('button', { name: 'Save' }).click();
  await userPage.getByRole('button', { name: 'Edit Bio' }).click();
  await userPage.getByRole('button', { name: 'Cancel' }).click();
  await expect(userPage.getByRole('heading', { name: 'User Profile' })).toBeVisible();
  await expect(userPage.getByRole('heading', { name: 'Details' })).toBeVisible();
  await expect(userPage.getByRole('navigation')).toBeVisible();
  await userPage.getByRole('link', { name: 'UH Marketplace Logo UH' }).click();
  await userPage.getByRole('button', { name: 'Search' }).click();
  await userPage.getByRole('link', { name: 'Add' }).click();
  await userPage.getByRole('link', { name: 'Explore' }).click();
  await userPage.getByRole('link', { name: 'Favorites' }).click();
  await userPage.getByRole('button', { name: 'Sign Out' }).click();
});
