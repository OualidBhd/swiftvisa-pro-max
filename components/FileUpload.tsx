'use client';

import { useState, useRef } from 'react';

type UploadFieldProps = {
  label: string;
  onUploaded: (url: string) => void;
};

export default function UploadField({ label, onUploaded }: UploadFieldProps) {
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
      className="border-2 border-black rounded-lg p-4 bg-white shadow-md hover:shadow-lg transition cursor-pointer space-y-2"
      onClick={() => inputRef.current?.click()}
    >
      <label className="block font-semibold text-gray-800">{label}</label>

      <div className="flex justify-between items-center gap-4">
        <span className="text-sm text-gray-600">
          {uploading ? 'جاري الرفع...' : fileName || 'انقر لاختيار الوثيقة'}
        </span>
        <button
          type="button"
          className="bg-blue-600 text-white text-sm px-4 py-1 rounded hover:bg-blue-700"
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