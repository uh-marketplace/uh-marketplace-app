import { test, expect } from './auth-utils';

test('test', async ({ getUserPage }) => {
  const userPage = await getUserPage('john@foo.com', 'changeme');
  await userPage.goto('https://uh-marketplace-app.vercel.app/auth/signin');
  await expect(userPage.locator('div').filter({ hasText: 'Sign InEmailPasswordSigninDon' }).nth(2)).toBeVisible();
  await expect(userPage.locator('div').filter({ hasText: /^EmailPasswordSignin$/ })).toBeVisible();
  await expect(userPage.getByText('Don\'t have an account?Sign up')).toBeVisible();
  await userPage.getByRole('button', { name: 'Signin' }).click();
  await userPage.locator('input[name="email"]').click();
  await userPage.locator('input[name="password"]').click();
  await userPage.getByRole('link', { name: 'UH Marketplace Logo UH' }).click();
  await expect(userPage.getByRole('navigation')).toBeVisible();
  await expect(userPage.getByRole('contentinfo')).toBeVisible();
  await userPage.getByRole('link', { name: 'Add' }).click();
  await userPage.getByRole('link', { name: 'Explore' }).click();
  await userPage.getByRole('link', { name: 'Favorites' }).click();
  await userPage.getByRole('link', { name: 'Sign In' }).click();
});
