'use client';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const TrackingDashboard = dynamic(() => import('@/components/TrackingDashboard'), { ssr: false });

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-10">جارٍ تحميل الطلب...</div>}>
      <TrackingDashboard />
    </Suspense>
  );
}