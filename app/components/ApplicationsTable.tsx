'use client';

import { useEffect, useState } from 'react';

interface Application {
  id: number;
  fullName: string;
  email: string;
  visaType: string;
  travelDate: string;
  createdAt: string;
}

export default function ApplicationsTable({ userId }: { userId: string }) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch(`/api/application/${userId}`);
        const data = await res.json();
        if (data.success) {
          setApplications(data.applications);
        }
      } catch (err) {
        console.error('Failed to fetch applications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [userId]);

  if (loading) return <p>Loading...</p>;

  if (applications.length === 0) return <p>No applications found.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-600">
          <tr>
            <th className="p-3 border">Full Name</th>
            <th className="p-3 border">Email</th>
            <th className="p-3 border">Visa Type</th>
            <th className="p-3 border">Travel Date</th>
            <th className="p-3 border">Submitted</th>
          </tr>
        </thead>
        <tbody className="text-sm text-gray-700">
          {applications.map((app) => (
            <tr key={app.id} className="hover:bg-gray-50">
              <td className="p-3 border">{app.fullName}</td>
              <td className="p-3 border">{app.email}</td>
              <td className="p-3 border">{app.visaType}</td>
              <td className="p-3 border">{new Date(app.travelDate).toLocaleDateString()}</td>
              <td className="p-3 border">{new Date(app.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}