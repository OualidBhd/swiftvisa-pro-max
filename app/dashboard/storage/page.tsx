'use client';

import { useEffect, useState, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { DocumentIcon, PhotoIcon, PaperClipIcon } from '@heroicons/react/24/outline';

interface Application {
  id: number;
  passportImage: string;
  residencePermit: string;
  personalPhoto: string;
  additionalDocs?: string | null;
  createdAt: string;
}

export default function StoragePage() {
  const [files, setFiles] = useState<Application[]>([]);
  const [userInfo, setUserInfo] = useState<{ email: string; trackingCode: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('trackedApplication');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUserInfo(parsed);
      fetch('/api/tracking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setFiles([data.application]);
        });
    }
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
          <h1 className="text-4xl font-extrabold">📎 الوثائق المرفقة</h1>
          <p className="text-gray-800 mt-2">هذه هي الملفات التي رفعتها أثناء تقديم الطلب.</p>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="max-w-4xl mx-auto bg-white border-2 border-black rounded-2xl p-8 mt-6 space-y-8"
      >
        {files.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {files.map((app) => (
              <div key={app.id} className="space-y-4">
                <FileCard label="📄 صورة جواز السفر" url={app.passportImage} icon={<DocumentIcon className="w-5 h-5" />} />
                <FileCard label="📄 بطاقة الإقامة" url={app.residencePermit} icon={<DocumentIcon className="w-5 h-5" />} />
                <FileCard label="📄 صورة شخصية" url={app.personalPhoto} icon={<PhotoIcon className="w-5 h-5" />} />
                <FileCard label="📎 وثائق إضافية" url={app.additionalDocs} icon={<PaperClipIcon className="w-5 h-5" />} />
              </div>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">لا توجد وثائق مرفقة حالياً.</p>
        )}
      </motion.div>
    </main>
  );
}

function FileCard({ label, url, icon }: { label: string; url?: string | null; icon: ReactNode }) {
  if (!url) return null;
  const fileName = url.split('/').pop();
  const isImage = /\.(png|jpe?g|gif|webp)$/i.test(fileName || '');

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="relative bg-white p-4 rounded-lg border-2 border-black hover:shadow-lg transition duration-200"
    >
      <div className="absolute top-3 right-3 text-gray-700 bg-gray-100 p-1 rounded-full shadow-sm">{icon}</div>
      <p className="font-medium text-gray-500 mb-1">{label}</p>
      {isImage ? (
        <img src={url} alt={label} className="w-40 h-auto rounded shadow" />
      ) : (
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
          فتح الوثيقة
        </a>
      )}
      <p className="text-xs text-gray-500 mt-1 truncate">{fileName}</p>
    </motion.div>
  );
}