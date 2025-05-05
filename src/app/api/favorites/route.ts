// app/api/favorites/route.ts
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import authOptions from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) return NextResponse.json([]);

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (!user) return NextResponse.json([]);

  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    select: {
      item: {
        select: {
          id: true,
          name: true,
          price: true,
          location: true,
          condition: true,
          imageUrl: true,
          description: true,
          owner: true,
        },
      },
    },
  });

  return NextResponse.json(favorites);
}
