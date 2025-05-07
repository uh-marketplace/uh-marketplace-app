// app/userprofile/UserProfileContent.tsx

'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
// eslint-disable-next-line import/extensions
import ItemCard from '@/components/ItemCard';

interface Item {
  id: number;
  name: string;
  price: number;
  location: string;
  condition: string;
  description: string;
  imageUrl: string;
}

export default function UserProfileContent() {
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
        if (data?.bio) setBio(data.bio);
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
        if (data?.items) setItems(data.items);
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
            style={{
              gridTemplateColumns: 'repeat(auto-fill',
              display: 'grid',
            }}
          >
            <Row className="g-4">
              {items.map((item) => (
                <Col key={item.id} xs={12} sm={6} md={4} lg={3}>
                  <ItemCard
                    item={item}
                    initialFavorited
                  />
                </Col>

              ))}
            </Row>
          </div>
        )}
      </div>
    </div>
  );
}
