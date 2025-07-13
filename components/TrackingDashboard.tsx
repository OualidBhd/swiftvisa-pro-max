'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

export default function TrackingDashboard() {
  const [appData, setAppData] = useState<any>(null);
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

    if (trackingCode) {
      fetchApplication();
    }
  }, [trackingCode, router]);

  if (!trackingCode) return null;

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gray-50">
        <ArrowPathIcon className="w-8 h-8 text-blue-600 animate-spin" />
        <span className="ml-2 text-sm text-gray-600">جارٍ تحميل الطلب...</span>
      </main>
    );
  }

  return (
    <main className="flex-1 p-6 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-6">
        <h1 className="text-2xl font-bold text-[#1F2D5A]">📦 تتبع الطلب</h1>

        {appData ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-sm">
            <Info label="الاسم الكامل" value={appData.fullName} />
            <Info label="البريد الإلكتروني" value={appData.email} />
            <Info label="بلد الأصل" value={appData.countryOfOrigin} />
            <Info label="الوجهة" value={appData.destinationCountry} />
            <Info label="نوع التأشيرة" value={appData.visaType} />
            <Info label="تاريخ السفر" value={new Date(appData.travelDate).toLocaleDateString()} />
            <Info label="رقم التتبع" value={appData.trackingCode} />
            <div className="sm:col-span-2">
              <p className="font-medium text-gray-600">الحالة</p>
              <p className="font-semibold text-yellow-600">قيد المعالجة</p>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">لم يتم العثور على أي طلب بهذا الرمز.</p>
        )}
      </div>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-medium text-gray-600">{label}</p>
      <p>{value}</p>
    </div>
  );
}