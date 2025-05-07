'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
export const dynamic = 'force-dynamic';

interface Item {
  id: number;
  name: string;
  price: number;
  location: string;
  condition: string;
  description: string;
  imageUrl: string;
}

export default function UserProfilePage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const [bio, setBio] = useState<string | null>(null);
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (email) {
        const res = await fetch('/api/get-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (data?.bio) {
          setBio(data.bio);
        }
      }
    };

    const fetchUserItems = async () => {
      if (email) {
        const res = await fetch('/api/get-user-items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (data?.items) {
          setItems(data.items);
        }
      }
    };

    fetchUserData();
    fetchUserItems();
  }, [email]);

  if (!email) {
    return <p className="text-center mt-8 text-red-500">No user specified.</p>;
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-8 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-center">User Profile</h1>

      <div className="w-full max-w-2xl bg-white rounded shadow p-6 mb-6 flex flex-col items-center">
        <h2 className="text-2xl font-semibold mb-6 text-center">Details</h2>

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="text-center">
            <strong>Email:</strong>
            <br />
            {email}
          </div>
          <div className="text-center">
            <strong>Bio:</strong>
            <br />
            {bio || 'No bio set'}
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl bg-white rounded shadow p-6 mb-6 flex flex-col items-center">
        <h2 className="text-2xl font-semibold mb-8 text-center">Posted Items</h2>
        {items.length === 0 ? (
          <p className="text-center">This user has not posted any items yet.</p>
        ) : (
          <div
            className="grid gap-6 justify-center"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', display: 'grid' }}
          >
            {items.map((item) => (
              <div key={item.id} className="border rounded p-4 flex flex-col items-center" style={{ width: '250px' }}>
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  width={150}
                  height={150}
                  className="rounded mb-4 object-contain"
                />
                <h3 className="text-xl font-semibold text-center">{item.name}</h3>
                <p className="text-gray-600 text-center">
                  $
                  {item.price.toFixed(2)}
                </p>
                <p className="text-gray-600 text-center">
                  Location:
                  {item.location}
                </p>
                <p className="text-gray-600 text-center">
                  Condition:
                  {item.condition}
                </p>
                <p className="text-gray-600 text-center mt-2">{item.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
