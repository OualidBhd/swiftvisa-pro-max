'use client';

import { useEffect, useState } from 'react';

type Application = {
  id: string;
  type: string;
  status: string;
  travelDate: string;
  createdAt: string;
};

type User = {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
  applications: Application[];
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching users:', err);
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-[#1F2D5A] mb-2">Users</h1>
        <p className="text-gray-600">List of all registered users and their visa applications</p>
      </header>

      {loading ? (
        <p className="text-center text-blue-600">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="text-center text-gray-500">No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow text-sm">
            <thead>
              <tr className="bg-blue-50 text-left">
                <th className="p-3 border-b">Email</th>
                <th className="p-3 border-b">Name</th>
                <th className="p-3 border-b">Created</th>
                <th className="p-3 border-b">Applications</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.name || '-'}</td>
                  <td className="p-3">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="p-3">
                    {user.applications.length > 0 ? (
                      <ul className="list-disc pl-4 space-y-1">
                        {user.applications.map((app) => (
                          <li key={app.id}>
                            {app.type} - {app.status} (
                            {new Date(app.travelDate).toLocaleDateString()})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-400">No applications</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}