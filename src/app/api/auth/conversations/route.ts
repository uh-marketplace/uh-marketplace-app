import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
// eslint-disable-next-line import/extensions
import { prisma } from '@/lib/prisma';
// eslint-disable-next-line import/extensions
import authOptions from '@/lib/authOptions';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userEmail = session.user.email;

  try {
    // Get all conversations where the current user is a participant
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: { email: userEmail },
        },
      },
      include: {
        participants: true, // Include participants in the query
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    // Format the response with the last message

    interface FormattedConversation {
      id: string;
      participants: string[];
      lastMessage: string;
      lastMessageTime: string;
      updatedAt: Date;
    }

    interface Participant {
      email: string;
    }

    interface Message {
      content: string;
      createdAt: Date;
    }

    interface Conversation {
      id: string;
      participants: Participant[];
      messages: Message[];
      updatedAt: Date;
    }

    const formattedConversations: FormattedConversation[] = conversations.map((conversation: Conversation) => ({
      id: conversation.id.toString(),
      participants: conversation.participants.map((participant: Participant) => participant.email),
      lastMessage: conversation.messages[0]?.content || '',
      lastMessageTime: conversation.messages[0]?.createdAt.toISOString() || '',
      updatedAt: conversation.updatedAt,
    }));

    return NextResponse.json(formattedConversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const { participants } = data;

    if (!participants || !Array.isArray(participants) || participants.length < 2) {
      return NextResponse.json({ error: 'Invalid participants' }, { status: 400 });
    }

    // Check if this conversation already exists (same participants)
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        AND: participants.map(email => ({
          participants: {
            some: {
              email,
            },
          },
        })),
      },
    });

    if (existingConversation) {
      return NextResponse.json(existingConversation);
    }

    // Create a new conversation
    const newConversation = await prisma.conversation.create({
      data: {
        participants: {
          connect: participants.map((email: string) => ({ email })),
        },
      },
    });

    return NextResponse.json(newConversation);
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 });
  }
}
