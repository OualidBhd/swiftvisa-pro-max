import { Suspense } from 'react';
import TrackingDashboard from '@/components/TrackingDashboard';

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-10">جارٍ تحميل الطلب...</div>}>
      <TrackingDashboard />
    </Suspense>
  );
}