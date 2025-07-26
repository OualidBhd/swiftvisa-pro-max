'use client';

import { useState, useEffect, useCallback } from 'react';

type Application = {
  trackingCode: string;
  fullName: string;
  email: string;
  countryOfOrigin: string;
  destinationCountry: string;
  visaType: string;
  travelDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
};

export default function AdminPage() {
  const [isAllowed, setIsAllowed] = useState(false);
  const [codeInput, setCodeInput] = useState('');
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  // جلب الطلبات
  const fetchApplications = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/applications');
      const data = await res.json();
      if (data.success) {
        setApplications(data.applications);
      } else {
        console.error('فشل في تحميل الطلبات:', data.error);
      }
    } catch (err) {
      console.error('فشل في جلب الطلبات:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // تحديث حالة الطلب
  const updateStatus = async (trackingCode: string, status: 'APPROVED' | 'REJECTED') => {
    setUpdating(trackingCode);
    try {
      const res = await fetch(`/api/admin/applications/${trackingCode}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || '❌ فشل تحديث حالة الطلب');
      } else {
        alert(`✅ ${data.message}`);
        fetchApplications();
      }
    } catch (error) {
      console.error('❌ خطأ في تحديث الطلب:', error);
      alert('❌ خطأ أثناء الاتصال بالسيرفر');
    } finally {
      setUpdating(null);
    }
  };

  // التحقق من كود الأدمن
  useEffect(() => {
    const saved = localStorage.getItem('admin_code_verified');
    if (saved === 'true') {
      setIsAllowed(true);
      fetchApplications();
    } else {
      setLoading(false);
    }
  }, [fetchApplications]);

  const handleCheckCode = async () => {
    const res = await fetch('/api/check-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: codeInput }),
    });

    if (res.ok) {
      localStorage.setItem('admin_code_verified', 'true');
      setIsAllowed(true);
      fetchApplications();
    } else {
      alert('❌ الكود غير صحيح');
    }
  };

  // Loading UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">جارٍ التحميل...</p>
      </div>
    );
  }

  // شاشة كود الأدمن
  if (!isAllowed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-50 p-6">
        <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full border border-blue-100">
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">🔐 دخول الأدمن</h2>
          <input
            type="password"
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
            placeholder="أدخل كود الأدمن"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <button
            onClick={handleCheckCode}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded-lg transition duration-200"
          >
            دخول
          </button>
        </div>
      </div>
    );
  }

  // واجهة الأدمن
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-blue-800 border-b pb-4">🛡️ الطلبات</h1>

        {applications.length === 0 ? (
          <p className="text-gray-500">لا توجد طلبات حالياً.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((app) => (
              <div
                key={app.trackingCode}
                className="bg-white border shadow-md rounded-xl p-6 flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-lg font-bold text-blue-700 mb-1">{app.fullName}</h2>
                  <p className="text-sm text-gray-600 mb-2">✉️ {app.email}</p>
                  <p className="text-sm">🌍 {app.countryOfOrigin} ➜ {app.destinationCountry}</p>
                  <p className="text-sm">🎯 {app.visaType}</p>
                  <p className="text-sm">🗓️ {new Date(app.travelDate).toLocaleDateString()}</p>
                  <p className="mt-2 font-semibold text-gray-700">
                    📝 الحالة:
                    <span
                      className={`ml-2 px-2 py-1 text-white text-xs rounded ${
                        app.status === 'APPROVED'
                          ? 'bg-green-600'
                          : app.status === 'REJECTED'
                          ? 'bg-red-600'
                          : 'bg-yellow-500'
                      }`}
                    >
                      {app.status}
                    </span>
                  </p>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => updateStatus(app.trackingCode, 'APPROVED')}
                    disabled={updating === app.trackingCode}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1 rounded text-sm disabled:opacity-50"
                  >
                    {updating === app.trackingCode ? '...' : 'قبول'}
                  </button>
                  <button
                    onClick={() => updateStatus(app.trackingCode, 'REJECTED')}
                    disabled={updating === app.trackingCode}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-1 rounded text-sm disabled:opacity-50"
                  >
                    {updating === app.trackingCode ? '...' : 'رفض'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}