'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

type VerifyOK = {
  success: true;
  app: {
    trackingCode: string;
    fullName: string | null;
    paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
    status: 'AWAITING_PAYMENT' | 'PENDING' | 'APPROVED' | 'REJECTED';
    amountPaid: string | null;
    currency: string | null;
    updatedAt: string;
  };
};
type VerifyFail = { success: false; errorMessage: string };

export default function PaymentSuccessContent() {
  const params = useSearchParams();
  const router = useRouter();
  const sessionId = params.get('session_id');

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<VerifyOK | VerifyFail | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!sessionId) { setLoading(false); return; }
    (async () => {
      try {
        const r = await fetch(`/api/payment/verify?session_id=${encodeURIComponent(sessionId)}`);
        setData(await r.json());
      } catch {
        setData({ success: false, errorMessage: 'Network error' });
      } finally {
        setLoading(false);
      }
    })();
  }, [sessionId]);

  if (!sessionId) {
    return (
      <main className="max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-semibold">Payment</h1>
        <p className="mt-2 text-red-600">Missing session_id.</p>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="max-w-xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-60 bg-gray-200 rounded" />
          <div className="h-24 w-full bg-gray-200 rounded" />
          <div className="h-10 w-40 bg-gray-200 rounded" />
        </div>
      </main>
    );
  }

  if (!data || !('success' in data) || !data.success) {
    return (
      <main className="max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-semibold">Payment</h1>
        <p className="mt-2 text-red-600">{(data as VerifyFail)?.errorMessage || 'Verification failed'}</p>
        <button className="mt-4 px-4 py-2 rounded border" onClick={() => router.push('/payment-failed')}>
          Go to Payment Help
        </button>
      </main>
    );
  }

  const app = data.app;
  const amount = app.amountPaid ? Number(app.amountPaid).toFixed(2) : null;
  const currency = app.currency || 'EUR';

  return (
    <main className="max-w-xl mx-auto p-6">
      <div className="rounded-xl border p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🎉</span>
          <h1 className="text-2xl font-semibold">Payment Successful</h1>
        </div>

        <p className="mt-2 text-green-700">شكراً {app.fullName ?? ''}! توصّلنا بالدفع ديالك.</p>

        <div className="mt-5 grid gap-3">
          <div className="flex items-center justify-between rounded bg-gray-50 p-3">
            <div>
              <div className="text-xs text-gray-500">Tracking code</div>
              <div className="font-mono">{app.trackingCode}</div>
            </div>
            <button
              className="px-3 py-1 rounded border"
              onClick={async () => {
                await navigator.clipboard.writeText(app.trackingCode);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
            >
              {copied ? 'Copied ✓' : 'Copy'}
            </button>
          </div>

          <div className="flex justify-between rounded bg-gray-50 p-3">
            <span className="text-gray-600">Amount</span>
            <span className="font-medium">{amount ? `${amount} ${currency}` : '—'}</span>
          </div>

          <div className="flex justify-between rounded bg-gray-50 p-3">
            <span className="text-gray-600">Status</span>
            <span className="font-medium">{app.paymentStatus} · {app.status}</span>
          </div>

          <div className="flex justify-between rounded bg-gray-50 p-3">
            <span className="text-gray-600">Updated</span>
            <span>{new Date(app.updatedAt).toLocaleString()}</span>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            className="px-4 py-2 rounded bg-black text-white"
            onClick={() => router.push(`/dashboard?code=${encodeURIComponent(app.trackingCode)}`)}
          >
            Open Dashboard
          </button>
          <button className="px-4 py-2 rounded border" onClick={() => router.push('/')}>
            Back to Home
          </button>
        </div>
      </div>
    </main>
  );
}