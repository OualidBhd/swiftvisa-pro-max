'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TrackingPage() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/tracking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, trackingCode: code }),
    });

    const data = await res.json();

    if (data.success) {
      // إعادة التوجيه إلى صفحة لوحة التحكم
      router.push(`/dashboard/${code}`);
    } else {
      setError(data.error || 'No application found.');
    }
  };

  return (
    <main className="min-h-screen p-6 bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-[#1F2D5A] mb-6">Track Your Application</h1>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg space-y-4">
        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 border rounded"
        />
        <input
          type="text"
          placeholder="Tracking Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          className="w-full p-3 border rounded"
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700">
          Track
        </button>
        {error && <p className="text-red-600 text-center">{error}</p>}
      </form>
    </main>
  );
}