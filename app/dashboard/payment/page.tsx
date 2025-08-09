'use client';

import React, { useEffect, useState, ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCardIcon,
  CurrencyDollarIcon,
  IdentificationIcon,
} from '@heroicons/react/24/outline';
import { loadStripe } from '@stripe/stripe-js';          // ⬅️ جديد
import { theme } from '@/lib/theme';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK!); // ⬅️ جديد

interface PaymentData {
  trackingCode: string;
  visaType: string;
  amount: number;
  status: 'PENDING' | 'PAID' | 'FAILED';
}

export default function PaymentPage() {
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);           // ⬅️ (اختياري) لحظر الزر أثناء التحويل

  useEffect(() => {
    const stored = localStorage.getItem('trackedApplication');
    if (stored) {
      const parsed = JSON.parse(stored);
      setPaymentData({
        trackingCode: parsed.trackingCode,
        visaType: parsed.visaType,
        amount: 0.99,           // تقدر تجيبها لاحقاً من API
        status: 'PENDING',
      });
    }
    setLoading(false);
  }, []);

  const handlePayment = async () => {
    if (!paymentData) return;
    try {
      setPaying(true);

      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackingCode: paymentData.trackingCode,
          amount: Number(paymentData.amount), // ⬅️ مهم بزاف
        }),
      });

      const data = await res.json();

      // نفضّلو redirectToCheckout ب sessionId (أأمن)
      if (res.ok && data?.success && data?.id) {
        const stripe = await stripePromise;
        if (!stripe) throw new Error('Stripe not loaded');
        const result = await stripe.redirectToCheckout({ sessionId: data.id });
        if (result.error) alert(result.error.message || 'تعذر التحويل إلى صفحة الدفع');
        return;
      }

      // دعم الخلفية القديمة اللي كتردّ url مباشرة
      if (res.ok && data?.success && data?.url) {
        window.location.href = data.url;
        return;
      }

      alert(data?.errorMessage || 'تعذر بدء عملية الدفع، جرب مرة أخرى.');
    } catch (err: any) {
      console.error('خطأ أثناء الدفع:', err);
      alert(err?.message || 'حدث خطأ أثناء محاولة الدفع.');
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen" style={{ background: `linear-gradient(to bottom right, ${theme.colors.background}, #f8f9fa)` }}>
        <CreditCardIcon className="w-8 h-8 animate-spin" style={{ color: theme.colors.primary }} />
        <span className="ml-2 text-sm" style={{ color: theme.colors.text }}>
          جارٍ تحميل بيانات الدفع...
        </span>
      </main>
    );
  }

  return (
    <main className="flex-1 min-h-screen" style={{ background: `linear-gradient(to bottom right, ${theme.colors.background}, #f8f9fa)` }}>
      {/* Banner */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-b-3xl shadow-lg"
        style={{
          backgroundColor: theme.colors.primary,
          color: '#fff',
          borderBottom: `2px solid ${theme.colors.border}`,
        }}
      >
        <div className="relative p-8 text-center">
          <h1 className="text-4xl font-extrabold">💳 الدفع</h1>
          <p className="mt-2" style={{ color: '#f1f5f9' }}>مراجعة حالة الدفع الخاصة بطلبك.</p>
        </div>
      </motion.div>

      {/* Payment Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="max-w-4xl mx-auto rounded-2xl p-8 mt-6 space-y-8"
        style={{
          backgroundColor: '#fff',
          border: `1px solid ${theme.colors.border}`,
          boxShadow: theme.shadows.card,
        }}
      >
        {paymentData ? (
          <div className="space-y-6">
            <PaymentField
              label="رقم التتبع"
              value={paymentData.trackingCode}
              icon={<IdentificationIcon className="w-5 h-5" />}
            />
            <PaymentField
              label="نوع التأشيرة"
              value={paymentData.visaType}
              icon={<IdentificationIcon className="w-5 h-5" />}
            />
            <PaymentField
              label="المبلغ"
              value={`€${paymentData.amount}`}
              icon={<CurrencyDollarIcon className="w-5 h-5" />}
            />
            <PaymentStatus status={paymentData.status} />

            <div className="text-center mt-8">
              {paymentData.status === 'PENDING' ? (
                <button
                  onClick={handlePayment}
                  disabled={paying}
                  className="px-6 py-3 rounded-full shadow hover:opacity-90 transition font-bold disabled:opacity-60"
                  style={{
                    backgroundColor: theme.colors.secondary,
                    color: '#000',
                    boxShadow: theme.shadows.button,
                  }}
                >
                  {paying ? 'جارٍ التحويل…' : 'الدفع الآن'}
                </button>
              ) : (
                <p style={{ color: theme.colors.primary }} className="font-bold text-lg">
                  تم الدفع بنجاح ✔
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-center" style={{ color: theme.colors.textSecondary }}>
            لا توجد بيانات دفع حالياً.
          </p>
        )}
      </motion.div>
    </main>
  );
}

function PaymentField({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="relative p-4 rounded-lg transition duration-200"
      style={{
        backgroundColor: '#fff',
        border: `1px solid ${theme.colors.border}`,
        boxShadow: theme.shadows.card,
      }}
    >
      <motion.div
        className="absolute top-3 right-3 p-1 rounded-full flex items-center justify-center"
        style={{
          backgroundColor: '#fff',
          border: `1px solid ${theme.colors.border}`,
          color: theme.colors.text,
          width: '32px',
          height: '32px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        }}
        animate={{ y: [0, -3, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
      >
        {icon}
      </motion.div>
      <p className="font-medium mb-1" style={{ color: theme.colors.textSecondary }}>
        {label}
      </p>
      <p className="font-semibold" style={{ color: theme.colors.text }}>
        {value}
      </p>
    </motion.div>
  );
}

function PaymentStatus({ status }: { status: 'PENDING' | 'PAID' | 'FAILED' }) {
  const bgColor =
    status === 'PAID' ? '#BBF7D0' : status === 'FAILED' ? '#FCA5A5' : '#FDE68A';

  const text =
    status === 'PAID' ? 'تم الدفع بنجاح' : status === 'FAILED' ? 'فشل الدفع' : 'قيد الدفع';

  return (
    <p
      className="font-bold text-lg px-4 py-2 rounded-lg border-2"
      style={{ backgroundColor: bgColor, borderColor: theme.colors.border, color: theme.colors.text }}
    >
      {text}
    </p>
  );
}