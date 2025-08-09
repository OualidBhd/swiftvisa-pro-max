'use client';

import { Suspense } from 'react';
import PaymentSuccessContent from './payment-success-content';

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<main className="max-w-xl mx-auto p-6">Loading…</main>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}