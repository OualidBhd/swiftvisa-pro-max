'use client';

import { useEffect, useState } from 'react';
import Sidebar from '../../../components/Sidebar';

export default function ProfilePage() {
  const [appData, setAppData] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('trackedApplication');
    if (stored) {
      setAppData(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-4 md:p-6">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">ملفك الشخصي</h1>
          <p className="text-gray-600 text-sm md:text-base">معلوماتك الشخصية التي أدخلتها</p>
        </header>

        <section className="bg-white rounded-lg shadow p-6 max-w-3xl mx-auto">
          {appData ? (
            <form className="space-y-4">
              <Field label="الاسم الكامل" value={appData.fullName} />
              <Field label="البريد الإلكتروني" value={appData.email} />
              <Field label="بلد الإقامة" value={appData.countryOfOrigin} />
              <Field label="بلد الوجهة" value={appData.destinationCountry} />
              <Field label="نوع التأشيرة" value={appData.visaType} />
              <Field
                label="تاريخ السفر"
                value={new Date(appData.travelDate).toLocaleDateString()}
              />
              <Field label="رمز التتبع" value={appData.trackingCode} />

              <div className="pt-4 text-right">
                <button
                  type="button"
                  disabled
                  className="bg-blue-300 cursor-not-allowed text-white font-bold py-2 px-6 rounded-full"
                >
                  هذه المعلومات لا يمكن تعديلها
                </button>
              </div>
            </form>
          ) : (
            <p className="text-center text-gray-500">لا توجد بيانات متاحة في الوقت الحالي.</p>
          )}
        </section>
      </main>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="block font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        readOnly
        className="w-full p-3 border rounded bg-gray-100 text-gray-800"
      />
    </div>
  );
}