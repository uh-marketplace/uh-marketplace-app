'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { prisma } from '@/lib/prisma'; // Assuming you have prisma client set up like this
import { redirect } from 'next/navigation';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmail = async () => {
      if (session?.user?.email) {
        // Assuming the user is already authenticated via next-auth
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
        }
      }
    };

    if (status === 'authenticated') {
      fetchEmail();
    } else if (status === 'unauthenticated') {
      redirect('/api/auth/signin');
    }
  }, [session, status]);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex justify-center items-center h-screen">
      {email ? (
        <h1 className="text-2xl">Welcome, {email}</h1>
      ) : (
        <p>Loading your profile...</p>
      )}
    </div>
  );
}
