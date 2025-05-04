import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import ApplicationsTable from '@/components/ApplicationsTable';

export default async function ApplicationsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return <p className="p-6 text-red-500">You must be logged in to view your applications.</p>;
  }

  const userId = session.user.id;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-[#1F2D5A]">My Visa Applications</h1>
      <ApplicationsTable userId={userId} />
    </div>
  );
}