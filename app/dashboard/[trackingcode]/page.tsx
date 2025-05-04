'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { data: session } = useSession();
  const [appData, setAppData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      // محاولة الحصول على الطلب من خلال الجلسة
      if (session?.user?.email) {
        const res = await fetch('/api/apply');
        const data = await res.json();
        if (data.success && data.applications.length > 0) {
          setAppData(data.applications[0]);
          setLoading(false);
          return;
        }
      }

      // أو من خلال التتبع المحلي
      const email = localStorage.getItem('tracking_email');
      const code = localStorage.getItem('tracking_code');

      if (!email || !code) {
        router.push('/tracking');
        return;
      }

      const res = await fetch('/api/tracking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, trackingCode: code }),
      });

      const data = await res.json();
      if (data.success) {
        setAppData(data.application);
      } else {
        router.push('/tracking');
      }

      setLoading(false);
    };

    fetchData();
  }, [session]);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <main className="p-6 max-w-3xl mx-auto bg-white shadow rounded">
      <h1 className="text-2xl font-bold text-[#1F2D5A] mb-4">Application Dashboard</h1>
      {appData ? (
        <div className="space-y-2 text-gray-700 text-sm">
          <p><strong>Full Name:</strong> {appData.fullName}</p>
          <p><strong>Email:</strong> {appData.email}</p>
          <p><strong>Visa Type:</strong> {appData.visaType}</p>
          <p><strong>Travel Date:</strong> {new Date(appData.travelDate).toLocaleDateString()}</p>
          <p><strong>Status:</strong> Under Review</p>
        </div>
      ) : (
        <p>No application data found.</p>
      )}
    </main>
  );
}