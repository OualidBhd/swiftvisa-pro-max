'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const [msg, setMsg] = useState('✅ تم الدفع بنجاح. نثبّت التحديثات...');

  useEffect(() => {
    let cancelled = false;

    const go = async () => {
      const url = new URL(window.location.href);
      const code = url.searchParams.get('code') || '';
      const sessionId = url.searchParams.get('session_id') || '';

      // 1) تحقّق اختياري من الجلسة (إذا كاين session_id)
      try {
        if (sessionId) {
          await fetch('/api/payment/verify?session_id=' + encodeURIComponent(sessionId), {
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-store' },
          });
        }
      } catch {
        /* نكمّلو عادي حتى لو verify ما رجّعش */
      }

      // 2) Poll خفيف باش نتأكد الحالة تحدّثات فـ DB (PAID/PENDING)
      const pollOnce = async () => {
        try {
          const res = await fetch('/api/tracking?ts=' + Date.now(), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
            body: JSON.stringify({ trackingCode: code }),
            cache: 'no-store',
          });
          const j = await res.json();
          return j?.success ? j.application : null;
        } catch {
          return null;
        }
      };

      // حد أقصى 10 محاولات × 700ms ~ 7 ثواني
      let tries = 0;
      while (!cancelled && tries < 10) {
        const app = await pollOnce();
        if (app && (app.paymentStatus === 'PAID' || app.status !== 'AWAITING_PAYMENT')) {
          break;
        }
        tries += 1;
        await new Promise(r => setTimeout(r, 700));
      }

      // 3) Redirect للداشبورد مع كسر الكاش
      const dest = code ? `/dashboard?code=${encodeURIComponent(code)}&ts=${Date.now()}` : `/dashboard?ts=${Date.now()}`;
      setMsg('تم الدفع ✅ — نحولك للوحة التحكم...');
      setTimeout(() => !cancelled && router.replace(dest), 300);
    };

    go();
    return () => { cancelled = true; };
  }, [router]);

  return (
    <main style={{ padding: 24, textAlign: 'center' }}>
      <h1>✅ نجاح الدفع</h1>
      <p>{msg}</p>
    </main>
  );
}