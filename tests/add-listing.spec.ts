import { test, expect } from './auth-utils';

test.slow();
test('test', async ({ getUserPage }) => {
  const userPage = await getUserPage('john@foo.com', 'changeme');
  await userPage.goto('https://uh-marketplace-app.vercel.app/add');
  await expect(userPage.locator('div').filter({ hasText: /^Add New Item$/ })).toBeVisible();
  await expect(userPage.locator('div').filter({
    hasText: /^NameConditionExcellentGoodFairPoorPriceLocationImage URLDescriptionSubmitReset$/ })).toBeVisible();
  await expect(userPage.locator('div').filter({ hasText: /^Name$/ }).nth(1)).toBeVisible();
  await expect(userPage.getByText('Condition')).toBeVisible();
  await expect(userPage.getByText('ConditionExcellentGoodFairPoor')).toBeVisible();
  await expect(userPage.locator('div').filter({ hasText: /^Price$/ }).nth(1)).toBeVisible();
  await expect(userPage.locator('div').filter({ hasText: /^Location$/ }).nth(1)).toBeVisible();
  await expect(userPage.locator('div').filter({ hasText: /^Image URL$/ })).toBeVisible();
  await expect(userPage.locator('div').filter({ hasText: /^Description$/ })).toBeVisible();
  await expect(userPage.getByText('SubmitReset')).toBeVisible();
});
