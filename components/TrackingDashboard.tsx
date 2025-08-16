'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowPathIcon, CheckCircleIcon, XCircleIcon, ClockIcon, CurrencyDollarIcon,
  UserIcon, EnvelopeIcon, GlobeAltIcon, MapIcon, IdentificationIcon, CalendarIcon, HashtagIcon,
} from '@heroicons/react/24/outline';
import { theme } from '@/lib/theme';

type Application = {
  fullName: string; email: string; countryOfOrigin: string; destinationCountry: string;
  visaType: string; travelDate: string; trackingCode: string;
  status: 'AWAITING_PAYMENT' | 'PENDING' | 'APPROVED' | 'REJECTED';
  paymentStatus?: 'PENDING' | 'PAID' | 'FAILED';
};

export default function TrackingDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState<string | null>(null);
  const [app, setApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  // استخرج الكود بشكل موثوق + fallback من localStorage
  useEffect(() => {
    const urlCode = searchParams.get('code');
    if (urlCode) {
      setCode(urlCode);
      return;
    }
    // fallback: إذا رجعنا من success بسرعة قبل ما يتكتب الكود فـ URL
    const ls = typeof window !== 'undefined' ? localStorage.getItem('tracking_code') : null;
    if (ls) {
      setCode(ls);
      // صحح العنوان باش مستقبلًا كلشي يعتمد على URL
      router.replace(`/dashboard?code=${encodeURIComponent(ls)}&ts=${Date.now()}`);
    } else {
      setCode(null);
    }
  }, [searchParams, router]);

  async function fetchApp(trackingCode: string) {
    const res = await fetch(`/api/tracking?ts=${Date.now()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      body: JSON.stringify({ trackingCode }),
      cache: 'no-store',
    });
    const data = await res.json();
    if (!data?.success) throw new Error('notfound');
    return data.application as Application;
  }

  // اجلب التطبيق + retry صغير
  useEffect(() => {
    if (!code) { setLoading(false); return; }
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        let attempt = 0, lastErr: any = null;
        while (attempt < 3) {
          try {
            const a = await fetchApp(code);
            if (!alive) return;
            setApp(a);
            localStorage.setItem('trackedApplication', JSON.stringify(a));
            setLoading(false);
            return;
          } catch (e) {
            lastErr = e;
            attempt += 1;
            await new Promise(r => setTimeout(r, 300));
          }
        }
        throw lastErr ?? new Error('fetch failed');
      } catch {
        setApp(null);
        setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [code]);

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen"
        style={{ background: `linear-gradient(to bottom right, ${theme.colors.background}, #f8f9fa)` }}>
        <ArrowPathIcon className="w-8 h-8 animate-spin" style={{ color: theme.colors.primary }} />
        <span className="ml-2 text-sm" style={{ color: theme.colors.text }}>جارٍ تحميل الطلب...</span>
      </main>
    );
  }

  if (!code || !app) {
    return (
      <main className="flex items-center justify-center min-h-screen"
        style={{ background: `linear-gradient(to bottom right, ${theme.colors.background}, #f8f9fa)` }}>
        <div className="text-center">
          <p className="mb-3">ما لقيناش طلب مرتبط بهذا الرابط.</p>
          <a href="/tracking" className="underline">الرجوع لصفحة التتبع</a>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 min-h-screen"
      style={{ background: `linear-gradient(to bottom right, ${theme.colors.background}, #f8f9fa)` }}>
      <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="relative rounded-b-3xl shadow-lg"
        style={{ backgroundColor: theme.colors.primary, color: '#fff', borderBottom: `2px solid ${theme.colors.border}` }}>
        <div className="relative p-8 text-center">
          <h1 className="text-4xl font-extrabold">{app.fullName || 'المستخدم'}</h1>
          <p className="mt-2" style={{ color: '#f1f5f9' }}>تتبع حالة طلبك بسهولة واطلع على جميع التفاصيل.</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.2 }}
        className="max-w-4xl mx-auto rounded-2xl p-8 mt-6 space-y-8"
        style={{ backgroundColor: '#fff', border: `1px solid ${theme.colors.border}`, boxShadow: theme.shadows.card }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
          <Info label="الاسم الكامل" value={app.fullName} icon={<UserIcon className="w-5 h-5" />} />
          <Info label="البريد الإلكتروني" value={app.email} icon={<EnvelopeIcon className="w-5 h-5" />} />
          <Info label="بلد الأصل" value={app.countryOfOrigin} icon={<GlobeAltIcon className="w-5 h-5" />} />
          <Info label="الوجهة" value={app.destinationCountry} icon={<MapIcon className="w-5 h-5" />} />
          <Info label="نوع التأشيرة" value={app.visaType} icon={<IdentificationIcon className="w-5 h-5" />} />
          <Info label="تاريخ السفر" value={new Date(app.travelDate).toLocaleDateString()} icon={<CalendarIcon className="w-5 h-5" />} />
          <Info label="رقم التتبع" value={app.trackingCode} icon={<HashtagIcon className="w-5 h-5" />} />

          <motion.div whileHover={{ scale: 1.02 }} className="sm:col-span-2 rounded-lg p-4 text-center"
            style={{ backgroundColor: theme.colors.background, border: `1px solid ${theme.colors.border}` }}>
            <p className="font-medium mb-1" style={{ color: theme.colors.text }}>حالة الطلب</p>
            <StatusBadge status={app.status} />
            <p className="mt-2 text-xs text-gray-500">
              الدفع: {app.paymentStatus === 'PAID' ? 'تم الدفع' : app.paymentStatus === 'FAILED' ? 'فشل' : 'قيد الدفع'}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}

function Info({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} className="relative p-4 rounded-lg transition duration-200"
      style={{ backgroundColor: '#fff', border: `1px solid ${theme.colors.border}`, boxShadow: theme.shadows.card }}>
      <motion.div className="absolute top-3 right-3 p-1 rounded-full flex items-center justify-center"
        style={{ backgroundColor: '#fff', border: `1px solid ${theme.colors.border}`, boxShadow: '0 1px 2px rgba(0,0,0,0.05)', width: '32px', height: '32px' }}
        animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}>
        <span style={{ color: theme.colors.text }}>{icon}</span>
      </motion.div>
      <p className="font-medium mb-1" style={{ color: theme.colors.textSecondary }}>{label}</p>
      <p className="font-semibold" style={{ color: theme.colors.text }}>{value}</p>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: Application['status'] }) {
  let color = '', icon = null as ReactNode | null;
  if (status === 'APPROVED') { color = 'text-green-700 bg-green-100'; icon = <CheckCircleIcon className="w-5 h-5 inline-block mr-1" />; }
  else if (status === 'REJECTED') { color = 'text-red-700 bg-red-100'; icon = <XCircleIcon className="w-5 h-5 inline-block mr-1" />; }
  else if (status === 'AWAITING_PAYMENT') { color = 'text-orange-700 bg-orange-100'; icon = <CurrencyDollarIcon className="w-5 h-5 inline-block mr-1" />; }
  else { color = 'text-yellow-700 bg-yellow-100'; icon = <ClockIcon className="w-5 h-5 inline-block mr-1" />; } // PENDING

  const text = status === 'APPROVED' ? 'تمت الموافقة'
    : status === 'REJECTED' ? 'تم الرفض'
    : status === 'AWAITING_PAYMENT' ? 'في انتظار الدفع'
    : 'قيد المعالجة';

  return (
    <p className={`font-bold text-lg px-4 py-2 rounded-lg border ${color}`} style={{ borderColor: theme.colors.border }}>
      {icon}{text}
    </p>
  );
}