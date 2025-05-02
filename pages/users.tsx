import { useEffect, useState } from 'react';

type User = {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
};

export default function UsersPage(props) {
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
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '1rem' }}>قائمة المستخدمين</h1>

      {loading ? (
        <p>جاري التحميل...</p>
      ) : users.length === 0 ? (
        <p>لا يوجد مستخدمين حاليا.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Email</th>
              <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Name</th>
              <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Created At</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td style={{ padding: '8px 0' }}>{user.email}</td>
                <td>{user.name || '-'}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}