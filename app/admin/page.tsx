'use client';

import { useEffect, useState } from 'react';

type AppItem = {
  id: number | string;
  email: string;
  trackingCode: string;
  fromCountry?: string | null;
  toCountry?: string | null;
  visaType?: string | null;
  travelDate?: string | null;
  status?: string | null;
  paymentStatus?: string | null;
  passportImage?: string | null;
  residencePermit?: string | null;
  personalPhoto?: string | null;
  additionalDocs?: string | null;
  createdAt: string;
};

export default function AdminPage() {
  const [apps, setApps] = useState<AppItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/applications', { cache: 'no-store' });
      const data = await res.json();
      if (data?.success) setApps(data.applications);
      else setApps([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(id: AppItem['id'], status: 'APPROVED' | 'REJECTED') {
    const res = await fetch('/api/admin/applications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      setApps(prev => prev.map(a => (a.id === id ? { ...a, status } : a)));
    } else {
      alert('تعذر التحديث');
    }
  }

  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">لوحة الأدمين — الطلبات</h1>
          <form onSubmit={async (e) => {
            e.preventDefault();
            await fetch('/api/admin/logout', { method: 'POST' });
            window.location.href = '/admin-login';
          }}>
            <button className="px-4 py-2 rounded bg-red-600 text-white">خروج</button>
          </form>
        </header>

        {loading ? (
          <p>جارٍ التحميل...</p>
        ) : apps.length === 0 ? (
          <p>لا توجد طلبات.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {apps.map(app => {
              const extras = (app.additionalDocs || '')
                .split(',')
                .map(s => s.trim())
                .filter(Boolean);

              return (
                <div key={app.id} className="bg-white rounded-lg border p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{app.email}</p>
                      <p className="text-sm text-gray-500">🔑 {app.trackingCode}</p>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <p>{app.createdAt?.slice(0, 10)}</p>
                      {app.status && <p className="mt-1">الحالة: {app.status}</p>}
                      {app.paymentStatus && <p>الدفع: {app.paymentStatus}</p>}
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <p><span className="text-gray-500">من:</span> {app.fromCountry || '-'}</p>
                    <p><span className="text-gray-500">إلى:</span> {app.toCountry || '-'}</p>
                    <p><span className="text-gray-500">نوع التأشيرة:</span> {app.visaType || '-'}</p>
                    <p><span className="text-gray-500">تاريخ السفر:</span> {app.travelDate || '-'}</p>
                  </div>

                  <div className="mt-3 space-y-1">
                    {app.passportImage && (
                      <a href={app.passportImage} target="_blank" className="text-blue-600 underline">📄 جواز السفر</a>
                    )}
                    {app.residencePermit && (
                      <a href={app.residencePermit} target="_blank" className="text-blue-600 underline">📄 بطاقة الإقامة</a>
                    )}
                    {app.personalPhoto && (
                      <a href={app.personalPhoto} target="_blank" className="text-blue-600 underline">📄 صورة شخصية</a>
                    )}
                    {extras.map((u, i) => (
                      <a key={i} href={u} target="_blank" className="text-blue-600 underline">📎 وثيقة إضافية {i + 1}</a>
                    ))}
                  </div>

                  <div className="mt-4 flex gap-3">
                    <button onClick={() => updateStatus(app.id, 'APPROVED')}
                      className="px-4 py-2 rounded bg-green-600 text-white">قبول ✅</button>
                    <button onClick={() => updateStatus(app.id, 'REJECTED')}
                      className="px-4 py-2 rounded bg-red-600 text-white">رفض ❌</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}