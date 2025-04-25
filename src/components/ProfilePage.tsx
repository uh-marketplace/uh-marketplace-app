'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { useSession } from 'next-auth/react';

const ProfilePage: React.FC = () => {
  const { data: session, status } = useSession();
  const [userItems, setUserItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      if (session?.user?.email) {
        const res = await fetch(`/api/user-items?email=${session.user.email}`);
        const data = await res.json();
        setUserItems(data);
      }
      setLoading(false);
    };
    fetchItems();
  }, [session]);

  if (status === 'loading') return <p className="text-center mt-5">Loading...</p>;
  if (!session?.user) return <p className="text-center mt-5">Please sign in to view your profile.</p>;

  return (
    <div className="container">
      <div className="profile-banner">
        <Image
          src="/images/default-avatar.png"
          alt="User Avatar"
          width={100}
          height={100}
          style={{ borderRadius: '50%', objectFit: 'cover' }}
        />
        <div className="profile-details">
          <h2>{session.user.name || 'UH User'}</h2>
          <p>Email: {session.user.email}</p>
          <p>Member since: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <section>
        <h3>About</h3>
        <p>Welcome to your UH Marketplace profile!</p>
      </section>

      <section>
        <h3>Posted Items</h3>
        <div className="items-grid">
          {userItems.map((item: any) => (
            <div className="item-card" key={item.id}>
              <Image
                src={item.imageUrl}
                alt={item.name}
                width={300}
                height={120}
                style={{ objectFit: 'cover', borderRadius: '6px' }}
              />
              <p>{item.name} - ${item.price}</p>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        * { box-sizing: border-box; }
        .container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 2rem 1rem;
          font-family: Arial, sans-serif;
        }
        .profile-banner {
          background-color: #00664b;
          color: white;
          padding: 2rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          border-radius: 10px;
        }
        .profile-details h2 { margin: 0; }
        section {
          margin-top: 2rem;
          padding: 1.5rem;
          background-color: #f9f9f9;
          border-radius: 10px;
        }
        h3 {
          margin-bottom: 1rem;
          color: #333;
        }
        .items-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 1rem;
        }
        .item-card {
          background: white;
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 1rem;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;