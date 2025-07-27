'use client';

import { useEffect, useState, ReactNode } from 'react';
import {
  UserIcon,
  EnvelopeIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { theme } from '@/lib/theme';

export default function ProfilePage() {
  const [appData, setAppData] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('trackedApplication');
    if (stored) setAppData(JSON.parse(stored));
  }, []);

  return (
    <main
      className="flex-1 min-h-screen"
      style={{
        background: `linear-gradient(to bottom right, ${theme.colors.background}, #f8f9fa)`,
      }}
    >
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
          <h1 className="text-4xl font-extrabold">
            {appData?.fullName || 'المستخدم'}
          </h1>
          <p className="mt-2" style={{ color: '#f1f5f9' }}>
            هذه بيانات ملفك الشخصي
          </p>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="max-w-4xl mx-auto rounded-2xl p-8 mt-6 space-y-8"
        style={{
          backgroundColor: '#fff',
          border: `1px solid ${theme.colors.border}`,
          boxShadow: theme.shadows.card,
        }}
      >
        <h2
          className="text-2xl font-bold text-center"
          style={{ color: theme.colors.primary }}
        >
          👤 معلوماتك الشخصية
        </h2>

        {appData ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <Info
              label="الاسم الكامل"
              value={appData.fullName}
              icon={<UserIcon className="w-5 h-5" />}
            />
            <Info
              label="البريد الإلكتروني"
              value={appData.email}
              icon={<EnvelopeIcon className="w-5 h-5" />}
            />
            <Info
              label="بلد الإقامة"
              value={appData.countryOfOrigin}
              icon={<GlobeAltIcon className="w-5 h-5" />}
            />
          </div>
        ) : (
          <p className="text-center" style={{ color: theme.colors.textSecondary }}>
            لا توجد بيانات متاحة في الوقت الحالي.
          </p>
        )}
      </motion.div>
    </main>
  );
}

function Info({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
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
          border: `1px solid ${theme.colors.border}`, // الكونتور الكحل
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          width: '32px',
          height: '32px',
        }}
        animate={{ y: [0, -3, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
      >
        <span style={{ color: theme.colors.text }}>{icon}</span>
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