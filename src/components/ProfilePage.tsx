import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import Image from 'next/image';

const prisma = new PrismaClient();

const ProfilePage = async () => {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return <p className="text-center mt-5">You must be signed in to view your profile.</p>;
  }

  const userInfo = await prisma.user.findUnique({
    where: { email: user.email },
    select: { email: true, role: true },
  });

  if (!userInfo) {
    return <p className="text-center mt-5">User not found in database.</p>;
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
          <h2>{userInfo.email}</h2>
          <p>Email: {userInfo.email}</p>
          <p>Role: {userInfo.role}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
