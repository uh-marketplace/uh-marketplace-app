'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabase = createClientComponentClient();

const ProfilePage: React.FC = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const userEmail = session?.user?.email ?? null;
      setEmail(userEmail);


      if (userEmail) {
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

        setItems(userItems || []);
      }
    };

    fetchUserData();
  }, []);

  if (!userInfo) {
    return <p className="text-center mt-5">Please sign in to view your profile.</p>;
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
          <h2>
            {userInfo.email || 'UH User'}
          </h2>
          <p>
            Email: {userInfo.email}
          </p>
          <p>
            Member since: {new Date().toLocaleDateString()}
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
            <div key={item.id} className="item-card">
              <Image
                src={item.imageUrl}
                alt={item.name}
                width={300}
                height={120}
                style={{ objectFit: 'cover', borderRadius: '6px' }}
              />
              <p>
                {item.name} - ${item.price}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3>Manage Your Posts</h3>
        <div className="manage-buttons">
          <button type="button" onClick={() => console.log('Edit Post Clicked')}>
            Edit Post
          </button>
          <button type="button" onClick={() => console.log('Delete Post Clicked')}>
            Delete Post
          </button>
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;
