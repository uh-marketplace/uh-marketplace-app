import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    const items = await prisma.item.findMany({
      where: { owner: email },
      select: {
        id: true,
        name: true,
        condition: true,
        price: true,
        location: true,
        owner: true,
        imageUrl: true,
        description: true,
      },
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch user items' }, { status: 500 });
  }
}
