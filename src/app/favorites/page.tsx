'use client';

import { useEffect, useState } from 'react';
import ItemCard from '@/components/ItemCard';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function FavoritesPage() {
  const { status } = useSession();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      const res = await fetch('/api/favorites');
      const data = await res.json();
      setFavorites(data);
      setLoading(false);
    };

    if (status === 'authenticated') {
      fetchFavorites();
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status]);

  const removeFromFavorites = async (itemId: number) => {
    await fetch('/api/favorite', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId }),
    });

    setFavorites((prev) => prev.filter((fav) => fav.item.id !== itemId));
  };

  if (status === 'loading' || loading) return <p className="text-center">Loading...</p>;

  if (status === 'unauthenticated') {
    return (
      <main className="text-center py-10">
        <h2>You must be logged in to view favorites.</h2>
        <Link href="/auth/signin" className="btn btn-primary mt-3">Sign in</Link>
      </main>
    );
  }

  return (
    <main className="bg-white min-vh-100">
      <div className="text-center py-4">
        <h1 className="fw-bold mb-2" style={{ color: '#00664B' }}>Favorites</h1>
        <p>Revisit listings you liked in your Heart List</p>
      </div>
      <div className="container">
        <div className="row g-4">
          {favorites.length === 0 ? (
            <p className="text-center">You have no favorites yet.</p>
          ) : (
            favorites.map((fav) => (
              <div key={fav.item.id} className="col-xs-12 col-sm-6 col-md-4 col-lg-3">
                <ItemCard
                  item={fav.item}
                  initialFavorited
                  onUnfavorite={() => removeFromFavorites(fav.item.id)}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
