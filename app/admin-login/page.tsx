'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [code, setCode]   = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        alert('بيانات الدخول غير صحيحة');
      } else {
        router.push('/admin');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-4 border p-6 rounded-lg bg-white">
        <h1 className="text-xl font-bold text-center">دخول الأدمين</h1>
        <div>
          <label className="block mb-1">الإيميل</label>
          <input className="w-full border p-2 rounded" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="block mb-1">الرمز السري</label>
          <input type="password" className="w-full border p-2 rounded" value={code} onChange={e => setCode(e.target.value)} />
        </div>
        <button disabled={loading} className="w-full py-2 rounded bg-black text-white">
          {loading ? 'جارٍ الدخول...' : 'دخول'}
        </button>
      </form>
    </main>
  );
}