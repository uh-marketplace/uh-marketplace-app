'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabase = createClientComponentClient();

const ProfilePage = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      console.log('Session:', sessionData);
      if (sessionError) console.error('Session error:', sessionError.message);

      const { data: userData, error: userError } = await supabase.auth.getUser();
      console.log('User:', userData);
      if (userError) console.error('User error:', userError.message);

      if (userData?.user?.email) {
        setEmail(userData.user.email);
      } else {
        setEmail(null);
      }

      setLoading(false);
    };

    getUser();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!email) return <p>You must be signed in to view this page.</p>;

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h2>User Profile</h2>
      <p>
        <strong>
          Email:
        </strong>
        {email}
      </p>
    </div>
  );
};

export default ProfilePage;
