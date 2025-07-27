'use client';

import { useState, useRef } from 'react';
import { theme } from '@/lib/theme';

type UploadFieldProps = {
  onUploaded: (url: string) => void;
  buttonStyle?: React.CSSProperties;
  borderColor?: string;
};

export default function UploadField({ onUploaded, buttonStyle, borderColor }: UploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setFileName(file.name);
    setError('');
    setFileUrl('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('فشل رفع الملف');

      const data = await res.json();
      if (data.success) {
        setFileUrl(data.url);
        onUploaded(data.url);
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className="rounded-lg p-4 bg-white hover:shadow-lg transition cursor-pointer space-y-2"
      style={{
        border: `1px solid ${borderColor || theme.colors.border}`,
      }}
      onClick={() => inputRef.current?.click()}
    >
      <div className="flex justify-between items-center gap-4">
        <span className="text-sm" style={{ color: theme.colors.text }}>
          {uploading ? 'جاري الرفع...' : fileName || 'انقر لاختيار الوثيقة'}
        </span>
        <button
          type="button"
          style={{
            backgroundColor: theme.colors.primary,
            color: '#fff',
            boxShadow: theme.shadows.button,
            padding: '4px 16px',
            borderRadius: '4px',
            ...buttonStyle,
          }}
        >
          رفع
        </button>
      </div>

      {error && <p className="text-red-500 text-sm">✖ {error}</p>}
      {fileUrl && /\.(png|jpe?g|webp|gif)$/i.test(fileUrl) && (
        <img src={fileUrl} alt="uploaded preview" className="w-24 h-auto rounded shadow" />
      )}

      <input
        ref={inputRef}
        type="file"
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,.pdf"
      />
    </div>
  );
}