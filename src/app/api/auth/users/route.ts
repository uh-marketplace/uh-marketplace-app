// eslint-disable-next-line import/extensions
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Fetch all users
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    // Add a simple status field for demonstration purposes
    const usersWithStatus = users.map(user => ({
      ...user,
      status: Math.random() > 0.5 ? 'online' : 'offline',
      lastActive: new Date().toISOString(),
    }));

    return NextResponse.json(usersWithStatus);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
