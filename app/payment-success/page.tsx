'use client';
import { useEffect, useState } from 'react';

export default function PaymentSuccessPage() {
  const [msg, setMsg] = useState('جاري التحقق من الدفع...');
  const [detail, setDetail] = useState<any>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const url = new URL(window.location.href);
        const sessionId = url.searchParams.get('session_id');
        if (!sessionId) { setMsg('لا يوجد session_id في الرابط'); return; }

        console.log('🔎 session_id =', sessionId);

        const res = await fetch(`/api/payment/verify?session_id=${sessionId}`);
        const json = await res.json();
        console.log('✅ verify response:', json);

        if (!json.success) {
          setMsg('تعذّر التحقق من الدفع.');
          setDetail(json);
          return;
        }

        setMsg('تم الدفع بنجاح ✅ تم تحويل الطلب إلى قيد المعالجة.');
        setDetail(json.app);
      } catch (e) {
        console.error(e);
        setMsg('وقع خطأ غير متوقع أثناء التحقق.');
      }
    };
    run();
  }, []);

  return (
    <main style={{padding: 24}}>
      <h1>Payment Result</h1>
      <p>{msg}</p>
      {detail && (
        <pre style={{marginTop:12, background:'#f6f6f6', padding:12}}>
          {JSON.stringify(detail, null, 2)}
        </pre>
      )}
      <a href="/tracking" style={{display:'inline-block', marginTop:16, padding:'8px 14px', background:'#111', color:'#fff', borderRadius:8}}>
        الذهاب لصفحة التتبع
      </a>
    </main>
  );
}