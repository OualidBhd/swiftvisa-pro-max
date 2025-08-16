// components/AnalyticsTracker.tsx
'use client';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function AnalyticsTracker() {
  return (
    <>
      <Analytics />       {/* كيتكلف بتتبع الزيارات و الـ bounce rate */}
      <SpeedInsights />   {/* اختياري: كيعطيك أداء السرعة */}
    </>
  );
}