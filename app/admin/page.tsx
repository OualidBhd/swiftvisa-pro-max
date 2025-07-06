'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // تحقق من أن المستخدم مسجل كأدمين
    if (session?.user?.role !== 'ADMIN') {
      router.push('/');
    }
  }, [session, router]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch('/api/admin/applications');
        const data = await res.json();
        if (data.success) {
          setApplications(data.applications);
        }
      } catch (err) {
        console.error('Failed to load applications', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">🛂 Visa Applications - Admin Panel</h1>
      {loading ? (
        <p>Loading applications...</p>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="bg-white p-4 rounded shadow">
              <p><strong>Full Name:</strong> {app.fullName}</p>
              <p><strong>Email:</strong> {app.email}</p>
              <p><strong>Visa Type:</strong> {app.visaType}</p>
              <p><strong>Status:</strong> {app.status || 'Pending'}</p>

              <div className="mt-3 space-x-2">
                <button
                  onClick={() => updateStatus(app.id, 'approved')}
                  className="px-4 py-1 bg-green-600 text-white rounded"
                >
                  Approve
                </button>
                <button
                  onClick={() => updateStatus(app.id, 'rejected')}
                  className="px-4 py-1 bg-red-600 text-white rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  async function updateStatus(id: number, status: string) {
    const res = await fetch('/api/admin/update-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });

    const result = await res.json();
    if (result.success) {
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status } : app))
      );
    } else {
      alert('Failed to update status');
    }
  }
}