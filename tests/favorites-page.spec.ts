import { test, expect } from './auth-utils';

test('test', async ({ getUserPage }) => {
  const userPage = await getUserPage('john@foo.com', 'changeme');
  await userPage.goto('https://uh-marketplace-app.vercel.app/favorites');
  await expect(userPage.getByText('FavoritesRevisit listings you')).toBeVisible();
});
