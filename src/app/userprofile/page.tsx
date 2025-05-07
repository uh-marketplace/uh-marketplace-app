// app/userprofile/page.tsx
'use client';

import { Suspense } from 'react';
import UserProfileContent from './UserProfileContent.tsx';

export default function UserProfilePage() {
  return (
    <Suspense fallback={<div className="text-center mt-8">Loading profile...</div>}>
      <UserProfileContent />
    </Suspense>
  );
}
