import { PrismaClient, Role, Condition } from '@prisma/client';
import { hash } from 'bcrypt';
import config from '../config/settings.development.json'; // Make sure tsconfig.json allows JSON imports

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding the database');

  const password = await hash('changeme', 10);

  // ✅ Use for...of to handle async properly
  for (const account of config.defaultAccounts) {
    const role = (account.role as Role) || Role.USER;
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
  }

  for (const data of config.defaultData) {
    const condition = (data.condition as Condition) || Condition.good;
    console.log(`  Adding stuff: ${JSON.stringify(data)}`);
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

  for (const data of config.defaultItems) {
    const condition = (data.condition as Condition) || Condition.good;
    console.log(`  Adding item: ${JSON.stringify(data)}`);
    await prisma.item.upsert({
      where: { id: config.defaultItems.indexOf(data) + 1 },
      update: {},
      create: {
        name: data.name,
        condition,
        price: data.price,
        location: data.location,
        owner: data.owner,
        imageUrl: data.imageUrl,
        description: data.description,
      },
    });
  }
}

main()
  .then(() => {
    console.log('🌱 Seeding complete');
    return prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error during seed:', e); // ✅ show full error
    await prisma.$disconnect();
    process.exit(1);
  });
