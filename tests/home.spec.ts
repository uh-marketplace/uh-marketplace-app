import { test, expect } from './auth-utils';

test('test', async ({ getUserPage }) => {
  const userPage = await getUserPage('john@foo.com', 'changeme');
  await userPage.goto('https://uh-marketplace-app.vercel.app/');
  await userPage.getByRole('button', { name: 'Start Browsing' }).click();
  await expect(
    userPage.getByText('Buy, Sell, and Trade on CampusWelcome to UH Marketplace – a safe and easy place'),
  ).toBeVisible();
  await expect(userPage.locator('div').filter({ hasText: /^Search$/ })).toBeVisible();
  await userPage.getByRole('link', { name: 'UH Marketplace Logo UH' }).click();
  await userPage.getByRole('searchbox', { name: 'Search' }).click();
  await userPage.getByRole('button', { name: 'Search' }).click();
  await userPage.getByRole('link', { name: 'Add' }).click();
  await userPage.getByRole('link', { name: 'Explore' }).click();
  await userPage.getByRole('link', { name: 'Favorites' }).click();
  await userPage.getByRole('button', { name: 'Sign Out' }).click();
});
