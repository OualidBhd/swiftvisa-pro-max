'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const [msg, setMsg] = useState('نثبّت الدفع...');

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const url = new URL(window.location.href);
      const code = url.searchParams.get('code') || '';
      const sessionId = url.searchParams.get('session_id') || '';

      // حدّث DB عبر verify (بدون Webhook)
      try {
        if (sessionId) {
          await fetch(
            '/api/payment/verify?session_id=' + encodeURIComponent(sessionId),
            {
              cache: 'no-store',
              headers: { 'Cache-Control': 'no-store' },
            }
          );
        }
      } catch {
        // حتى لو فشل، نكمل للداشبورد; الـ polling كيغطي
      }

      // ريديركت مع كسر الكاش
      const dest = code
        ? `/dashboard?code=${encodeURIComponent(code)}&ts=${Date.now()}`
        : `/dashboard?ts=${Date.now()}`;

      setMsg('تم الدفع ✅ — نحولك إلى لوحة التحكم...');
      setTimeout(() => {
        if (!cancelled) router.replace(dest);
      }, 500);
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <main style={{ padding: 24, textAlign: 'center' }}>
      <h1>✅ نجاح الدفع</h1>
      <p>{msg}</p>
    </main>
  );
}