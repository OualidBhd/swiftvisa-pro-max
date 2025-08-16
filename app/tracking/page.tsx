'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { theme } from '@/lib/theme';

export default function TrackingPage() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);

    try {
      const trimmed = code.trim();
      const res = await fetch('/api/tracking?ts=' + Date.now(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
        body: JSON.stringify({ trackingCode: trimmed }),
        cache: 'no-store',
      });
      const data = await res.json();

      if (data.success) {
        router.push(`/dashboard?code=${encodeURIComponent(trimmed)}`);
      } else {
        setError(data.error || 'لا يوجد طلب مطابق.');
      }
    } catch {
      setError('حدث خطأ. حاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen px-4"
      style={{ background: `linear-gradient(to bottom right, ${theme.colors.background}, #f8f9fa)` }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="w-full max-w-md rounded-xl p-8"
        style={{ backgroundColor: '#fff', border: `1px solid ${theme.colors.border}`, boxShadow: theme.shadows.card }}>
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center" style={{ color: theme.colors.primary }}>
          تتبع طلبك
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* الإيميل اختياري للواجهة فقط */}
          <div>
            <label className="block mb-1 text-sm font-medium" style={{ color: theme.colors.text }}>البريد الإلكتروني</label>
            <input type="email" placeholder="example@email.com" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded focus:outline-none focus:ring" style={{ border: `1px solid ${theme.colors.border}`, color: theme.colors.text }} />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium" style={{ color: theme.colors.text }}>رمز التتبع</label>
            <input type="text" placeholder="أدخل رمز التتبع" value={code} onChange={(e) => setCode(e.target.value)} required
              className="w-full p-3 rounded focus:outline-none focus:ring" style={{ border: `1px solid ${theme.colors.border}`, color: theme.colors.text }} />
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 rounded font-semibold transition hover:scale-[1.02]"
            style={{ backgroundColor: loading ? '#9cccf5' : theme.colors.primary, color: '#fff', boxShadow: theme.shadows.button, cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'جاري التحقق...' : 'تتبع'}
          </button>

          {error && <p className="text-red-600 text-center text-sm">{error}</p>}
        </form>
      </motion.div>
    </main>
  );
}