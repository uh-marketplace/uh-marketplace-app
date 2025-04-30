<<<<<<< HEAD
=======
/* eslint-disable import/prefer-default-export */

>>>>>>> b3cf3b2e2200577b598dca45cb6c3ccf09dd7837
import { prisma } from '@/lib/prisma';
import ExplorePageContent from '@/components/ExplorePage';

export const dynamic = 'force-dynamic';

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
