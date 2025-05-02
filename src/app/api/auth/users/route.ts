import { NextResponse } from 'next/server';
import NextAuth, { getServerSession } from 'next-auth';
// eslint-disable-next-line import/extensions
import { prisma } from '@/lib/prisma';
// eslint-disable-next-line import/extensions
import authOptions from '@/lib/authOptions';

const handler = NextAuth(authOptions);
export { handler as POST };
// @ts-ignore - Temporarily disable for build
export async function GET() : Promise<NextResponse> {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get all users except the current user
    const users = await prisma.user.findMany({
      where: {
        email: {
          not: session.user.email,
        },
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    // Format users with fake status for demo purposes
    // In a real application, you would track user online status in your database
    interface User {
      id: number;
      email: string;
      role: string;
    }

    interface FormattedUser {
      email: string;
      displayName: string;
      image: string;
      status: 'online' | 'offline';
      lastActive: string;
    }

    const formattedUsers: FormattedUser[] = users.map((user: User) => ({
      email: user.email,
      displayName: user.email.split('@')[0], // Simple display name from email
      image: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email)}&background=random`,
      status: Math.random() > 0.5 ? 'online' : 'offline',
      lastActive: Math.random() > 0.5 ? '2 hours ago' : 'today',
    }));

    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
