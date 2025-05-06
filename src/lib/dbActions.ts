'use server';

import { Item, Condition } from '@prisma/client';
import { hash } from 'bcrypt';
import { redirect } from 'next/navigation';
import { prisma } from './prisma';

export async function addItem(item: { name: string;
  condition: string; price: number; location: string; owner: string; imageUrl: string; description: string; }) {
  // console.log(`addItem data: ${JSON.stringify(item, null, 2)}`);
  let condition: Condition = 'good';
  if (item.condition === 'poor') {
    condition = 'poor';
  } else if (item.condition === 'excellent') {
    condition = 'excellent';
  } else {
    condition = 'fair';
  }
  await prisma.item.create({
    data: {
      name: item.name,
      condition,
      price: item.price,
      location: item.location,
      owner: item.owner,
      imageUrl: item.imageUrl,
      description: item.description,
    },
  });
  // After adding, redirect to the list page
  redirect('/profile');
}

export async function editItem(item: Item) {
  // console.log(`editItem data: ${JSON.stringify(item, null, 2)}`);
  await prisma.item.update({
    where: { id: item.id },
    data: {
      name: item.name,
      condition: item.condition,
      price: item.price,
      location: item.location,
      owner: item.owner,
      imageUrl: item.imageUrl,
      description: item.description,
    },
  });
  // After updating, redirect to the list page
  redirect('/profile');
}

export async function deleteItem(id: number) {
  // console.log(`deleteItem id: ${id}`);
  await prisma.item.delete({
    where: { id },
  });
  // After deleting, redirect to the list page
  redirect('/profile');
}

/**
 * Creates a new user in the database.
 * @param credentials, an object with the following properties: email, password.
 */
export async function createUser(credentials: { email: string; password: string }) {
  // console.log(`createUser data: ${JSON.stringify(credentials, null, 2)}`);
  const password = await hash(credentials.password, 10);
  await prisma.user.create({
    data: {
      email: credentials.email,
      password,
      bio: '',
    },
  });
}

/**
 * Changes the password of an existing user in the database.
 * @param credentials, an object with the following properties: email, password.
 */
export async function changePassword(credentials: { email: string; password: string }) {
  // console.log(`changePassword data: ${JSON.stringify(credentials, null, 2)}`);
  const password = await hash(credentials.password, 10);
  await prisma.user.update({
    where: { email: credentials.email },
    data: {
      password,
    },
  });
}
