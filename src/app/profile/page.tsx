'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from 'react-bootstrap'; // <-- Bootstrap Button

interface Item {
  id: number;
  name: string;
  price: number;
  location: string;
  condition: string;
  description: string;
  imageUrl: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [bio, setBio] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newBio, setNewBio] = useState('');
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.email) {
        const res = await fetch('/api/get-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: session.user.email }),
        });
        const data = await res.json();
        if (data?.email) {
          setEmail(data.email);
          setBio(data.bio);
        }
      }
    };

    const fetchUserItems = async () => {
      if (session?.user?.email) {
        const res = await fetch('/api/get-user-items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: session.user.email }),
        });
        const data = await res.json();
        if (data?.items) {
          setItems(data.items);
        }
      }
    };

    if (status === 'authenticated') {
      fetchUserData();
      fetchUserItems();
    } else if (status === 'unauthenticated') {
      redirect('/api/auth/signin');
    }
  }, [session, status]);

  const handleSaveBio = async () => {
    if (!session?.user?.email) return;

    const res = await fetch('/api/update-bio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: session.user.email, bio: newBio }),
    });

    const data = await res.json();
    if (data.success) {
      setBio(newBio);
      setIsEditing(false);
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this item?');
    if (!confirmDelete) return;

    const res = await fetch('/api/delete-item', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: itemId }),
    });

    if (res.ok) {
      setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    } else {
      window.alert('Failed to delete item.');
    }
  };

  if (status === 'loading') {
    return <p>Loading...</p>;
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
            {isEditing ? (
              <input
                className="border p-1 rounded w-full mt-1 text-center"
                value={newBio}
                onChange={(e) => setNewBio(e.target.value)}
                placeholder="Enter your bio"
              />
            ) : (
              bio || 'No bio set'
            )}
          </div>

          {isEditing ? (
            <div className="d-flex gap-2">
              <Button variant="success" onClick={handleSaveBio}>Save</Button>
              <Button variant="success" onClick={() => setIsEditing(false)}>Cancel</Button>
            </div>
          ) : (
            <div className="text-center">
              <Button
                  variant="success"
                onClick={() => {
                  setNewBio(bio || '');
                  setIsEditing(true);
                }
                }>
                Edit Bio
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="w-full max-w-7xl bg-white rounded shadow p-6 mb-6 flex flex-col items-center">
        <h2 className="text-2xl font-semibold mb-8 text-center">Posted Items</h2>
        {items.length === 0 ? (
          <p className="text-center">You have not posted any items yet.</p>
        ) : (
          <div
            className="grid gap-6 justify-center"
            style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              display: 'grid',
            }}
          >
            {items.map((item) => (
              <div
                key={item.id}
                className="border rounded p-4 flex flex-col items-center"
                style={{ width: '250px' }}
              >
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  width={150}
                  height={150}
                  className="rounded mb-4 object-contain"
                />
                <h3 className="text-xl font-semibold text-center">{item.name}</h3>
                <p className="text-gray-600 text-center">{item.price.toFixed(2)}</p>
                <p className="text-gray-600 text-center">
                  Location:
                  {item.location}
                </p>
                <p className="text-gray-600 text-center">
                  Condition:
                  {item.condition}
                </p>
                <p className="text-gray-600 text-center mt-2">
                  {item.description}
                </p>

                <div className="d-flex gap-2 mt-3">
                  <Button variant="success" onClick={() => router.push(`/edit/${item.id}`)}>Edit</Button>
                  <Button variant="success" onClick={() => handleDeleteItem(item.id)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
