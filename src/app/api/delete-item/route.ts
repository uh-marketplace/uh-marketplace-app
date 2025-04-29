import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
  }

  try {
    await prisma.item.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}
