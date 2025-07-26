'use client';

import { useEffect, useState, ReactNode } from 'react';
import {
  UserIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  MapIcon,
  IdentificationIcon,
  CalendarIcon,
  HashtagIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const [appData, setAppData] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('trackedApplication');
    if (stored) setAppData(JSON.parse(stored));
  }, []);

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
          <h1 className="text-4xl font-extrabold">{appData?.fullName || 'المستخدم'}</h1>
          <p className="text-gray-800 mt-2">هذه بيانات ملفك الشخصي</p>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="max-w-4xl mx-auto bg-white border-2 border-black rounded-2xl p-8 mt-6 space-y-8"
      >
        <h2 className="text-2xl font-bold text-black text-center">👤 معلوماتك الشخصية</h2>

        {appData ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700 text-sm">
            <Info label="الاسم الكامل" value={appData.fullName} icon={<UserIcon className="w-5 h-5" />} />
            <Info label="البريد الإلكتروني" value={appData.email} icon={<EnvelopeIcon className="w-5 h-5" />} />
            <Info label="بلد الإقامة" value={appData.countryOfOrigin} icon={<GlobeAltIcon className="w-5 h-5" />} />
            <Info label="بلد الوجهة" value={appData.destinationCountry} icon={<MapIcon className="w-5 h-5" />} />
            <Info label="نوع التأشيرة" value={appData.visaType} icon={<IdentificationIcon className="w-5 h-5" />} />
            <Info label="تاريخ السفر" value={new Date(appData.travelDate).toLocaleDateString()} icon={<CalendarIcon className="w-5 h-5" />} />
            <Info label="رمز التتبع" value={appData.trackingCode} icon={<HashtagIcon className="w-5 h-5" />} />
          </div>
        ) : (
          <p className="text-center text-gray-500">لا توجد بيانات متاحة في الوقت الحالي.</p>
        )}
      </motion.div>
    </main>
  );
}

function Info({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
      className="relative bg-white p-4 rounded-lg border-2 border-black hover:shadow-lg transition duration-200"
    >
      <motion.div
        className="absolute top-3 right-3 text-gray-700 bg-gray-100 p-1 rounded-full shadow-sm"
        animate={{ y: [0, -2, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
      >
        {icon}
      </motion.div>
      <p className="font-medium text-gray-500 mb-1">{label}</p>
      <p className="text-gray-800 font-semibold">{value}</p>
    </motion.div>
  );
}