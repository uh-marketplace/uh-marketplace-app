import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const { itemId } = await req.json();

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const created = await prisma.favorite.create({
    data: {
      userId: user.id,
      itemId,
    },
  });

  return NextResponse.json(created);
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  const { itemId } = await req.json();

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  await prisma.favorite.deleteMany({
    where: {
      userId: user.id,
      itemId,
    },
  });

  return NextResponse.json({ message: 'Removed from favorites' });
}
