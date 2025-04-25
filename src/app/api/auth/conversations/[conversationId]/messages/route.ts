import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import authOptions from '@/lib/authOptions';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const conversationId = searchParams.get('conversationId');

  if (!conversationId) {
    return NextResponse.json({ error: 'Conversation ID is required' }, { status: 400 });
  }

  try {
    // First, check if the user is a participant in this conversation
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: parseInt(conversationId, 10),
      },
    });

    if (!conversation || !conversation.participants.includes(session.user.email)) {
      return NextResponse.json({ error: 'Unauthorized access to this conversation' }, { status: 403 });
    }

    // Get messages for this conversation
    const messages = await prisma.message.findMany({
      where: {
        conversationId: parseInt(conversationId, 10),
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const { content, conversationId } = data;

    if (!content || !conversationId) {
      return NextResponse.json({ error: 'Content and conversation ID are required' }, { status: 400 });
    }

    // Check if the user is a participant in this conversation
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
    });

    if (!conversation || !conversation.participants.includes(session.user.email)) {
      return NextResponse.json({ error: 'Unauthorized access to this conversation' }, { status: 403 });
    }

    // Create the message
    const newMessage = await prisma.message.create({
      data: {
        content,
        sender: session.user.email,
        conversationId,
      },
    });

    // Update the conversation's updatedAt timestamp
    await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(newMessage);
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json({ error: 'Failed to create message' }, { status: 500 });
  }
}
