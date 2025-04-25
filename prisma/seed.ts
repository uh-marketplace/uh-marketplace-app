import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import config from '../config/settings.development.json';

enum Condition {
  good = 'good',
  fair = 'fair',
  poor = 'poor',
}

enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

const prisma = new PrismaClient();
async function main() {
  console.log('Seeding the database');
  const password = await hash('changeme', 10);
  config.defaultAccounts.forEach(async (account) => {
    const role = account.role as Role || Role.USER;
    console.log(`  Creating user: ${account.email} with role: ${role}`);
    await prisma.user.upsert({
      where: { email: account.email },
      update: {},
      create: {
        email: account.email,
        password,
        role,
      },
    });
    // console.log(`  Created user: ${user.email} with role: ${user.role}`);
  });
  for (const data of config.defaultData) {
    const condition = data.condition as Condition || Condition.good;
    console.log(`  Adding stuff: ${JSON.stringify(data)}`);
    // eslint-disable-next-line no-await-in-loop
    await prisma.stuff.upsert({
      where: { id: config.defaultData.indexOf(data) + 1 },
      update: {},
      create: {
        name: data.name,
        quantity: data.quantity,
        owner: data.owner,
        condition,
      },
    });
  }

  // Create users
  const users = await Promise.all(
    config.defaultAccounts.map(async (account) => {
      const role = account.role as Role || Role.USER;
      console.log(`  Creating user: ${account.email} with role: ${role}`);

      // Using upsert to avoid duplicates
      return prisma.user.upsert({
        where: { email: account.email },
        update: {},
        create: {
          email: account.email,
          password,
          role,
        },
      });
    }),
  );

  // Create stuff items
  const stuffItems = [];
  await Promise.all(
    config.defaultData.map(async (data, index) => {
      const condition = data.condition as Condition || Condition.good;
      console.log(`  Adding stuff: ${JSON.stringify(data)}`);

      const stuff = await prisma.stuff.upsert({
        where: { id: index + 1 },
        update: {},
        create: {
          name: data.name,
          quantity: data.quantity,
          owner: data.owner,
          condition,
        },
      });

      stuffItems.push(stuff);
    }),
  );

  // Create some conversations and messages if users exist
  if (users.length >= 2) {
    console.log('  Creating conversations and messages');

    // Create a conversation between the first two users
    const conversation1 = await prisma.conversation.create({
      data: {
        name: 'General Chat',
        participants: {
          connect: [
            { id: users[0].id },
            { id: users[1].id },
          ],
        },
      },
    });

    // Add some messages to the conversation
    await prisma.message.createMany({
      data: [
        {
          content: 'Hey there! How are you doing?',
          senderId: users[0].id,
          receiverId: users[1].id,
          conversationId: conversation1.id,
          createdAt: new Date(Date.now() - 3600000 * 24), // 24 hours ago
        },
        {
          content: 'I\'m doing well! How about you?',
          senderId: users[1].id,
          receiverId: users[0].id,
          conversationId: conversation1.id,
          createdAt: new Date(Date.now() - 3600000 * 23), // 23 hours ago
        },
        {
          content: 'Just working on this new project. It\'s coming along nicely!',
          senderId: users[0].id,
          receiverId: users[1].id,
          conversationId: conversation1.id,
          createdAt: new Date(Date.now() - 3600000 * 22), // 22 hours ago
        },
      ],
    });

    // Create another conversation if there are at least 3 users
    if (users.length >= 3) {
      const conversation2 = await prisma.conversation.create({
        data: {
          name: 'Project Discussion',
          participants: {
            connect: [
              { id: users[0].id },
              { id: users[2].id },
            ],
          },
        },
      });

      // Add some messages to the second conversation
      await prisma.message.createMany({
        data: [
          {
            content: 'Have you reviewed the latest specs?',
            senderId: users[0].id,
            receiverId: users[2].id,
            conversationId: conversation2.id,
            createdAt: new Date(Date.now() - 3600000 * 12), // 12 hours ago
          },
          {
            content: 'Yes, I\'ll send you my notes shortly.',
            senderId: users[2].id,
            receiverId: users[0].id,
            conversationId: conversation2.id,
            createdAt: new Date(Date.now() - 3600000 * 11), // 11 hours ago
          },
          {
            content: 'Thanks! Let\'s meet tomorrow to discuss.',
            senderId: users[0].id,
            receiverId: users[2].id,
            conversationId: conversation2.id,
            createdAt: new Date(Date.now() - 3600000 * 10), // 10 hours ago
          },
        ],
      });
    }
  }
}
main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
