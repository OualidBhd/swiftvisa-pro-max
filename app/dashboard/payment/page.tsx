'use client';

import React, { useEffect, useState, ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCardIcon,
  CurrencyDollarIcon,
  IdentificationIcon,
} from '@heroicons/react/24/outline';

interface PaymentData {
  trackingCode: string;
  visaType: string;
  amount: number;
  status: 'PENDING' | 'PAID' | 'FAILED';
}

export default function PaymentPage() {
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('trackedApplication');
    if (stored) {
      const parsed = JSON.parse(stored);

      // ⚠️ هنا مستقبلاً نجيب البيانات من API
      setPaymentData({
        trackingCode: parsed.trackingCode,
        visaType: parsed.visaType,
        amount: 99.99,
        status: 'PENDING',
      });
    }
    setLoading(false);
  }, []);

  const handlePayment = async () => {
    try {
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingCode: paymentData?.trackingCode }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url; // تحويل مباشر إلى Stripe Checkout
      } else {
        alert('تعذر بدء عملية الدفع، جرب مرة أخرى.');
      }
    } catch (err) {
      console.error('خطأ أثناء الدفع:', err);
      alert('حدث خطأ أثناء محاولة الدفع.');
    }
  };

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-green-100">
        <CreditCardIcon className="w-8 h-8 text-green-600 animate-spin" />
        <span className="ml-2 text-sm text-gray-700">جارٍ تحميل بيانات الدفع...</span>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-gradient-to-br from-green-50 to-green-100 min-h-screen">
      {/* Banner */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-noise text-black border-2 border-black rounded-b-3xl shadow-lg"
      >
        <div className="relative p-8 text-center">
          <h1 className="text-4xl font-extrabold">💳 الدفع</h1>
          <p className="text-gray-800 mt-2">مراجعة حالة الدفع الخاصة بطلبك.</p>
        </div>
      </motion.div>

      {/* Payment Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="max-w-4xl mx-auto bg-white border-2 border-black rounded-2xl p-8 mt-6 space-y-8"
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
              value={`$${paymentData.amount}`}
              icon={<CurrencyDollarIcon className="w-5 h-5" />}
            />
            <PaymentStatus status={paymentData.status} />

            <div className="text-center mt-8">
              {paymentData.status === 'PENDING' ? (
                <button
                  onClick={handlePayment}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full shadow"
                >
                  الدفع الآن
                </button>
              ) : (
                <p className="text-green-700 font-bold text-lg">تم الدفع بنجاح ✔</p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">لا توجد بيانات دفع حالياً.</p>
        )}
      </motion.div>
    </main>
  );
}

function PaymentField({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="relative bg-white p-4 rounded-lg border-2 border-black hover:shadow-lg transition duration-200"
    >
      <div className="absolute top-3 right-3 text-gray-700 bg-gray-100 p-1 rounded-full shadow-sm">{icon}</div>
      <p className="font-medium text-gray-500 mb-1">{label}</p>
      <p className="text-gray-800 font-semibold">{value}</p>
    </motion.div>
  );
}

function PaymentStatus({ status }: { status: 'PENDING' | 'PAID' | 'FAILED' }) {
  const color =
    status === 'PAID'
      ? 'bg-green-200 text-black'
      : status === 'FAILED'
      ? 'bg-red-200 text-black'
      : 'bg-yellow-200 text-black';

  const text =
    status === 'PAID'
      ? 'تم الدفع بنجاح'
      : status === 'FAILED'
      ? 'فشل الدفع'
      : 'قيد الدفع';

  return (
    <p className={`font-bold text-lg px-4 py-2 rounded-lg border-2 border-black ${color}`}>
      {text}
    </p>
  );
}
