/* eslint-disable import/prefer-default-export */

import { prisma } from '@/lib/prisma';
import ExplorePageContent from '@/components/ExplorePage';

export default async function Explore() {
  const items = await prisma.item.findMany();

  return (
    <main className="bg-white min-vh-100">
      <ExplorePageContent items={items} />
    </main>
  );
}
