'use client';

import { useSession } from '@supabase/auth-helpers-react';

const ProfilePage = () => {
  const session = useSession();

  if (!session) {
    return <p>You must be signed in to view this page.</p>;
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h2>User Profile</h2>
      <p>
        <strong>
          Email:
        </strong>
        {session.user.email}
      </p>
    </div>
  );
};

export default ProfilePage;
