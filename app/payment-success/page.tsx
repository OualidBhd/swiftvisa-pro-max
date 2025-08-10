// app/payment-success/page.tsx (أو route handler)
'use client'
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function PaymentSuccess() {
  const sp = useSearchParams();
  const sid = sp.get('session_id');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!sid) return;
    (async () => {
      await fetch(`/api/payment/verify?session_id=${encodeURIComponent(sid)}`);
      setDone(true);
    })();
  }, [sid]);

  // من بعد، ريفري لواجهة التتبع أو جيب الحالة الحالية
  // ...
}