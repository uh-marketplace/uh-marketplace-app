import { prisma } from '@/lib/prisma';
import ExplorePageContent from '@/components/ExplorePage';

export const dynamic = 'force-dynamic';

export default async function Explore() {
  const items = await prisma.item.findMany({
    orderBy: { id: 'desc' },
  });

  return (
    <main className="bg-white min-vh-100">
      <ExplorePageContent items={items} />
    </main>
  );
}
