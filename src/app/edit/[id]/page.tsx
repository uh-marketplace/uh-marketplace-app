import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import { Item } from '@prisma/client';
import authOptions from '@/lib/authOptions';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { prisma } from '@/lib/prisma';
import EditItemForm from '@/components/EditItemForm';

export default async function EditItemPage({ params }: { params: { id: string | string[] } }) {
  // Protect the page, only logged in users can access it.
  const session = await getServerSession(authOptions);
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; randomKey: string };
      // eslint-disable-next-line @typescript-eslint/comma-dangle
    } | null,
  );
  const id = Number(Array.isArray(params?.id) ? params?.id[0] : params?.id);
  // console.log(id);
  const item: Item | null = await prisma.item.findUnique({
    where: { id },
  });
  // console.log(stuff);
  if (!item) {
    return notFound();
  }

  return (
    <main>
      <EditItemForm item={item} />
    </main>
  );
}
