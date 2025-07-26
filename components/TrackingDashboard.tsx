'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  MapIcon,
  IdentificationIcon,
  CalendarIcon,
  HashtagIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

type Application = {
  fullName: string;
  email: string;
  countryOfOrigin: string;
  destinationCountry: string;
  visaType: string;
  travelDate: string;
  trackingCode: string;
  status: 'AWAITING_PAYMENT' | 'PENDING' | 'APPROVED' | 'REJECTED';
};

export default function TrackingDashboard() {
  const [appData, setAppData] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const trackingCode = searchParams.get('code');

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const res = await fetch(`/api/tracking`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ trackingCode }),
          cache: 'no-store',
        });

        const data = await res.json();
        if (data.success) {
          setAppData(data.application);
          localStorage.setItem('trackedApplication', JSON.stringify(data.application));
        } else {
          router.push('/tracking?error=notfound');
        }
      } catch (err) {
        console.error('Error fetching application:', err);
      } finally {
        setLoading(false);
      }
    };

    if (trackingCode) fetchApplication();
  }, [trackingCode, router]);

  if (!trackingCode) return null;

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-green-100">
        <ArrowPathIcon className="w-8 h-8 text-green-600 animate-spin" />
        <span className="ml-2 text-sm text-gray-700">جارٍ تحميل الطلب...</span>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-gradient-to-br from-green-50 to-green-100 min-h-screen">
      {/* Banner */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-noise text-black border-2 border-black rounded-b-3xl shadow-lg"
      >
        <div className="relative p-8 text-center">
          <h1 className="text-4xl font-extrabold">{appData?.fullName || 'المستخدم'}</h1>
          <p className="text-gray-800 mt-2">تتبع حالة طلبك بسهولة واطلع على جميع التفاصيل.</p>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="max-w-4xl mx-auto bg-white border-2 border-black rounded-2xl p-8 mt-6 space-y-8"
      >
        <h2 className="text-2xl font-bold text-black text-center">📦 تفاصيل الطلب</h2>

        {appData ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700 text-sm">
            <Info label="الاسم الكامل" value={appData.fullName} icon={<UserIcon className="w-5 h-5" />} />
            <Info label="البريد الإلكتروني" value={appData.email} icon={<EnvelopeIcon className="w-5 h-5" />} />
            <Info label="بلد الأصل" value={appData.countryOfOrigin} icon={<GlobeAltIcon className="w-5 h-5" />} />
            <Info label="الوجهة" value={appData.destinationCountry} icon={<MapIcon className="w-5 h-5" />} />
            <Info label="نوع التأشيرة" value={appData.visaType} icon={<IdentificationIcon className="w-5 h-5" />} />
            <Info label="تاريخ السفر" value={new Date(appData.travelDate).toLocaleDateString()} icon={<CalendarIcon className="w-5 h-5" />} />
            <Info label="رقم التتبع" value={appData.trackingCode} icon={<HashtagIcon className="w-5 h-5" />} />

            {/* الحالة */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="sm:col-span-2 bg-gray-50 rounded-lg p-4 border-2 border-black shadow-inner text-center"
            >
              <p className="font-medium text-gray-700 mb-1">الحالة</p>
              <StatusBadge status={appData.status} />
            </motion.div>
          </div>
        ) : (
          <p className="text-center text-gray-500">لم يتم العثور على أي طلب بهذا الرمز.</p>
        )}
      </motion.div>
    </main>
  );
}

function Info({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
      className="relative bg-white p-4 rounded-lg border-2 border-black hover:shadow-lg transition duration-200"
    >
      <motion.div
        className="absolute top-3 right-3 text-gray-700 bg-gray-100 p-1 rounded-full shadow-sm"
        animate={{ y: [0, -2, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
      >
        {icon}
      </motion.div>
      <p className="font-medium text-gray-500 mb-1">{label}</p>
      <p className="text-gray-800 font-semibold">{value}</p>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: string }) {
  let color = '';
  let icon = null;

  if (status === 'APPROVED') {
    color = 'bg-green-200 text-black';
    icon = <CheckCircleIcon className="w-5 h-5 inline-block mr-1" />;
  } else if (status === 'REJECTED') {
    color = 'bg-red-200 text-black';
    icon = <XCircleIcon className="w-5 h-5 inline-block mr-1" />;
  } else if (status === 'AWAITING_PAYMENT') {
    color = 'bg-orange-200 text-black';
    icon = <CurrencyDollarIcon className="w-5 h-5 inline-block mr-1" />;
  } else if (status === 'PENDING') {
    color = 'bg-yellow-200 text-black';
    icon = <ClockIcon className="w-5 h-5 inline-block mr-1" />;
  }

  const statusText =
    status === 'APPROVED'
      ? 'تمت الموافقة'
      : status === 'REJECTED'
      ? 'تم الرفض'
      : status === 'AWAITING_PAYMENT'
      ? 'في انتظار الدفع'
      : 'قيد المعالجة';

  return (
    <p className={`font-bold text-lg px-4 py-2 rounded-lg border-2 border-black ${color}`}>
      {icon}
      {statusText}
    </p>
  );
}