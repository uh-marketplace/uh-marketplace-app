import { prisma } from '@/lib/prisma';
import ItemCard from '@/components/ItemCard';

export const dynamic = 'force-dynamic';

export default async function SearchPage({ searchParams }: { searchParams: { query?: string } }) {
  const query = searchParams?.query?.trim();

  if (!query) return <p className="text-center mt-10">Please enter a search term.</p>;

  const items = await prisma.item.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
    },
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">
        Search Results for
        {query}
      </h1>
      {items.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <div className="row g-4">
          {items.map((item) => (
            <div key={item.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <ItemCard item={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
