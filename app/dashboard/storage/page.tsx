'use client';

import { useEffect, useState, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { DocumentIcon, PhotoIcon, PaperClipIcon } from '@heroicons/react/24/outline';
import { theme } from '@/lib/theme';

type Application = {
  id: number;
  passportImage: string;
  residencePermit: string;
  personalPhoto: string;
  additionalDocs?: string | string[] | null;
  createdAt: string;
};

export default function StoragePage() {
  const [app, setApp] = useState<Application | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/tracking/me', { cache: 'no-store' });
        const data = await res.json();
        if (data?.success) setApp(data.application as Application);
        else setApp(null);
      } catch { setApp(null); }
    })();
  }, []);

  const files = app ? buildFileItems(app) : [];

  return (
    <main className="flex-1 min-h-screen"
      style={{ background: `linear-gradient(to bottom right, ${theme.colors.background}, #f8f9fa)` }}>
      {/* Banner */}
      <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="relative rounded-b-3xl shadow-lg"
        style={{ backgroundColor: theme.colors.primary, color: '#fff', borderBottom: `2px solid ${theme.colors.border}` }}>
        <div className="relative p-8 text-center">
          <h1 className="text-4xl font-extrabold">📎 الوثائق المرفقة</h1>
          <p className="mt-2" style={{ color: '#f1f5f9' }}>هذه هي الملفات التي رفعتها أثناء تقديم الطلب.</p>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }} className="max-w-4xl mx-auto rounded-2xl p-8 mt-6"
        style={{ backgroundColor: '#fff', border: `1px solid ${theme.colors.border}`, boxShadow: theme.shadows.card }}>
        {files.length ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {files.map((f) => (
              <li key={f.key} className="list-none">
                <FileCard label={f.label} url={f.url} icon={f.icon} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center" style={{ color: theme.colors.textSecondary }}>لا توجد وثائق مرفقة حالياً.</p>
        )}
      </motion.div>
    </main>
  );
}

function buildFileItems(app: Application) {
  const extra =
    typeof app.additionalDocs === 'string'
      ? app.additionalDocs.split(',').map((s) => s.trim()).filter(Boolean)
      : Array.isArray(app.additionalDocs)
      ? app.additionalDocs
      : [];

  return [
    { key: `${app.id}-pass`, label: '📄 صورة جواز السفر', url: app.passportImage, icon: <DocumentIcon className="w-5 h-5" /> },
    { key: `${app.id}-res`,  label: '📄 بطاقة الإقامة',    url: app.residencePermit, icon: <DocumentIcon className="w-5 h-5" /> },
    { key: `${app.id}-pers`, label: '📄 صورة شخصية',       url: app.personalPhoto, icon: <PhotoIcon className="w-5 h-5" /> },
    ...(extra.length ? extra.map((u, i) => ({
      key: `${app.id}-extra-${i}`, label: '📎 وثيقة إضافية', url: u, icon: <PaperClipIcon className="w-5 h-5" />
    })) : []),
  ].filter((x) => !!x.url);
}

function FileCard({ label, url, icon }: { label: string; url: string; icon: ReactNode }) {
  const clean = (url.split('/').pop() || '').split('?')[0];
  const isImage = /\.(png|jpe?g|gif|webp)$/i.test(clean);
  return (
    <motion.div whileHover={{ scale: 1.02 }} className="relative p-4 rounded-lg"
      style={{ backgroundColor: '#fff', border: `1px solid ${theme.colors.border}`, boxShadow: theme.shadows.card }}>
      <motion.div className="absolute top-3 right-3 flex items-center justify-center rounded-full"
        style={{ backgroundColor: '#fff', border: `1px solid ${theme.colors.border}`, width: 32, height: 32, color: theme.colors.text }}
        animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
        {icon}
      </motion.div>
      <p className="font-medium mb-1" style={{ color: theme.colors.textSecondary }}>{label}</p>
      {isImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={label} className="w-40 h-auto rounded shadow" />
      ) : (
        <a href={url} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: theme.colors.primary }}>
          فتح الوثيقة
        </a>
      )}
      <p className="text-xs mt-1 truncate" style={{ color: theme.colors.textSecondary }}>{clean || 'ملف'}</p>
    </motion.div>
  );
}