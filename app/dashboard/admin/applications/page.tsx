import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import app from 'next/app';

export default async function AdminApplicationsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return redirect('/unauthorized');
  }

  const applications = await prisma.application.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          email: true,
        },
      },
    },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#1F2D5A] mb-6">All Visa Applications</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 text-sm">
          <thead className="bg-gray-100 text-left text-gray-600 font-semibold">
            <tr>
              <th className="p-3 border">Full Name</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Visa Type</th>
              <th className="p-3 border">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {applications.map((app) => (
              <tr key={app.id} className="hover:bg-gray-50">
                <td className="p-3 border">{app.userId}</td>
                <td className="p-3 border">{app.user.email}</td>
                <td className="p-3 border">{app.type}</td>
                <td className="p-3 border capitalize">{app.status}</td>
                <td className="p-3 border">{new Date(app.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}