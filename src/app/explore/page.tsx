/* eslint-disable import/prefer-default-export */

import { prisma } from '@/lib/prisma';
import ExplorePageContent from '@/components/ExplorePage';

export default async function Explore() {
  // Fetch all items from the database using Prisma
  const items = await prisma.item.findMany({
    orderBy: {
      id: 'desc', // optional: newest items first
    },
  });

  return (
    <main className="bg-white min-vh-100">
      <ExplorePageContent items={items} />
    </main>
  );
}
