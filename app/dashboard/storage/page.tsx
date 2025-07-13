'use client';

import { useEffect, useState } from 'react';

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

  const renderFileItem = (
    label: string,
    url: string | null | undefined,
  ) => {
    if (!url) return null;
    const fileName = url.split('/').pop();
    const isImage = /\.(png|jpe?g|gif|webp)$/i.test(fileName || '');

    return (
      <li key={label} className="border p-3 rounded flex flex-col gap-2">
        <p className="font-semibold text-[#1F2D5A]">{label}</p>
        {isImage ? (
          <img src={url} alt={label} className="w-32 h-auto rounded shadow" />
        ) : (
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            View Document
          </a>
        )}
        <span className="text-xs text-gray-500 truncate max-w-[200px]">{fileName}</span>
      </li>
    );
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <main className="flex-1 p-4 md:p-6">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">📎 الوثائق المرفقة</h1>
          <p className="text-gray-600 text-sm md:text-base">
            هذه هي الملفات التي قمت برفعها أثناء تقديم الطلب.
          </p>
        </header>

        <section className="bg-white rounded-lg shadow p-6 max-w-3xl mx-auto space-y-6">
          {files.length > 0 ? (
            <ul className="space-y-4">
              {files.map((app) => (
                <div key={app.id}>
                  {renderFileItem('📄 صورة جواز السفر', app.passportImage)}
                  {renderFileItem('📄 بطاقة الإقامة', app.residencePermit)}
                  {renderFileItem('📄 صورة شخصية', app.personalPhoto)}
                  {renderFileItem('📎 وثائق إضافية', app.additionalDocs)}
                </div>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm text-center">لا توجد وثائق مرفقة حالياً.</p>
          )}
        </section>
      </main>
    </div>
  );
}