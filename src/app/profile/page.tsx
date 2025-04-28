'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState<string | null>(null);
  const [bio, setBio] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newBio, setNewBio] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.email) {
        const res = await fetch('/api/get-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: session.user.email }),
        });
        const data = await res.json();
        if (data?.email) {
          setEmail(data.email);
          setBio(data.bio); // bio is included now
        }
      }
    };

    if (status === 'authenticated') {
      fetchUserData();
    } else if (status === 'unauthenticated') {
      redirect('/api/auth/signin');
    }
  }, [session, status]);

  const handleSaveBio = async () => {
    if (!session?.user?.email) return;

    const res = await fetch('/api/update-bio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: session.user.email, bio: newBio }),
    });

    const data = await res.json();
    if (data.success) {
      setBio(newBio);
      setIsEditing(false);
    }
  };

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-8 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">User Profile</h1>

      <div className="w-full max-w-2xl bg-white rounded shadow p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Details</h2>
        <p><strong>Email:</strong> {email}</p>
        <p className="mt-2">
          <strong>Bio:</strong>{' '}
          {isEditing ? (
            <input
              className="border p-1 rounded w-full mt-1"
              value={newBio}
              onChange={(e) => setNewBio(e.target.value)}
              placeholder="Enter your bio"
            />
          ) : (
            bio || 'No bio set'
          )}
        </p>

        {isEditing ? (
          <div className="mt-4">
            <button
              onClick={handleSaveBio}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-4 rounded mr-2"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-1 px-4 rounded"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              setNewBio(bio || '');
              setIsEditing(true);
            }}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Edit Bio
          </button>
        )}
      </div>
    </div>
  );
}
