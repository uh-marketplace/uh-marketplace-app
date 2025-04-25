'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabase = createClientComponentClient();

const ProfilePage: React.FC = () => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const userEmail = session?.user?.email ?? null;
      if (!userEmail) return;

      const { data: userData } = await supabase
        .from('User')
        .select('*')
        .eq('email', userEmail)
        .single();

      setUserInfo(userData);

      const { data: userItems } = await supabase
        .from('Item')
        .select('*')
        .eq('owner', userEmail);

      setItems(userItems ?? []);
      setLoading(false);
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <p className="text-center mt-5">Loading your profile...</p>;
  }

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
          <h2>{userInfo?.email ?? 'UH User'}</h2>
          <p>
            <strong>Email:</strong>
            <br />
            {userInfo?.email}
          </p>
          <p>
            <strong>Member since:</strong>
            <br />
            {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      <section>
        <h3>About</h3>
        <p>Welcome to your UH Marketplace profile!</p>
      </section>

      <section>
        <h3>Posted Items</h3>
        <div className="items-grid">
          {items.map((item) => (
            <div className="item-card" key={item.id}>
              <Image
                src={item.imageUrl || '/images/sample1.jpg'}
                alt={item.name}
                width={300}
                height={120}
                style={{ objectFit: 'cover', borderRadius: '6px' }}
              />
              <p>{item.name}</p>
              <p>
                $
                {item.price}
              </p>
            </div>
          ))}
        </div>
      </section>

      <style>
        {`
        * {
          box-sizing: border-box;
        }

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

        .profile-details h2 {
          margin: 0;
        }

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
      `}
      </style>
    </div>
  );
};

export default ProfilePage;
