'use client';

import Dynamic from 'next/dynamic';   // <-- بدّل الاسم
import { Suspense } from 'react';

export const dynamic = 'force-dynamic'; // <-- خاص تبقى بهاذ الاسم

const TrackingDashboard = Dynamic(
  () => import('@/components/TrackingDashboard'),
  { ssr: false }
);

export default function DashboardPage() {
  // نجيب الكود من الـ URL (بدون أخطاء تايب)
  const sp =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search)
      : null;
  const code = sp?.get('code') ?? '';

  return (
    <Suspense fallback={<div className="p-10">جارٍ تحميل الطلب...</div>}>
      <TrackingDashboard key={code || 'no-code'} />
    </Suspense>
  );
}