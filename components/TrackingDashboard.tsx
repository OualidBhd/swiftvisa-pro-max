'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

type Application = {
  fullName: string;
  email: string;
  countryOfOrigin: string;
  destinationCountry: string;
  visaType: string;
  travelDate: string;
  trackingCode: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
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

    if (trackingCode) {
      fetchApplication();
    }
  }, [trackingCode, router]);

  if (!trackingCode) return null;

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <ArrowPathIcon className="w-8 h-8 text-blue-600 animate-spin" />
        <span className="ml-2 text-sm text-gray-700">جارٍ تحميل الطلب...</span>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-gray-50 min-h-screen">
      {/* Banner */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white rounded-b-3xl shadow-lg">
        <div className="absolute inset-0 opacity-20 bg-[url('/banner-pattern.svg')] bg-cover"></div>
        <div className="relative p-8 text-center">
          <h1 className="text-4xl font-extrabold drop-shadow-lg">
            {appData?.fullName || 'المستخدم'}
          </h1>
          <p className="text-blue-100 mt-2">
            تتبع حالة طلبك بسهولة واطلع على جميع التفاصيل.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8 mt-6 space-y-8 border border-blue-100">
        <h2 className="text-2xl font-bold text-blue-900 text-center">📦 تفاصيل الطلب</h2>

        {appData ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700 text-sm">
            <Info label="الاسم الكامل" value={appData.fullName} />
            <Info label="البريد الإلكتروني" value={appData.email} />
            <Info label="بلد الأصل" value={appData.countryOfOrigin} />
            <Info label="الوجهة" value={appData.destinationCountry} />
            <Info label="نوع التأشيرة" value={appData.visaType} />
            <Info
              label="تاريخ السفر"
              value={new Date(appData.travelDate).toLocaleDateString()}
            />
            <Info label="رقم التتبع" value={appData.trackingCode} />

            {/* الحالة */}
            <div className="sm:col-span-2 bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg p-4 border border-gray-200 shadow-inner text-center">
              <p className="font-medium text-gray-600 mb-1">الحالة</p>
              <p
                className={`font-bold text-lg px-4 py-2 rounded-lg inline-block ${
                  appData.status === 'APPROVED'
                    ? 'bg-green-100 text-green-700'
                    : appData.status === 'REJECTED'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {appData.status === 'APPROVED'
                  ? 'تمت الموافقة'
                  : appData.status === 'REJECTED'
                  ? 'تم الرفض'
                  : 'قيد المعالجة'}
              </p>
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
    <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <p className="font-medium text-gray-500 mb-1">{label}</p>
      <p className="text-gray-800 font-semibold">{value}</p>
    </div>
  );
}