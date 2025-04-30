/* eslint-disable import/prefer-default-export */

import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import ExplorePageContent from '@/components/ExplorePage';

export default async function Explore() {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;

  const items = await prisma.item.findMany();

  let favoriteItemIds: number[] = [];

  if (userEmail) {
    const user = await prisma.user.findUnique({ where: { email: userEmail } });

    if (user) {
      const favorites = await prisma.favorite.findMany({
        where: { userId: user.id },
        select: { itemId: true },
      });

      favoriteItemIds = favorites.map((f) => f.itemId);
    }
  }

  return (
    <main className="bg-white min-vh-100">
      <ExplorePageContent items={items} favoriteItemIds={favoriteItemIds} />
    </main>
  );
}
