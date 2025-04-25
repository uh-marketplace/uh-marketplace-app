'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabase = createClientComponentClient();

const ProfilePage = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmail = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user?.email) {
        console.warn('User not signed in or error occurred.');
        setEmail(null);
      } else {
        setEmail(user.email);
      }

      setLoading(false);
    };

    fetchEmail();
  }, []);

  if (loading) return <p className="text-center mt-5">Loading profile...</p>;

  if (!email) return <p className="text-center mt-5">You must be signed in to view this page.</p>;

  return (
    <div className="container text-center mt-5">
      <h1 className="mb-3">User Profile</h1>
      <p>
        <strong>
          Email:
        </strong> 
        {email}
      </p>

      <style>{`
        .container {
          font-family: Arial, sans-serif;
          padding: 2rem;
        }
        h1 {
          color: #00664b;
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
