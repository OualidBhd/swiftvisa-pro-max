'use client';
import { useState } from 'react';

type UploadFieldProps = {
  label: string;
  onUploaded: (url: string) => void;
};

export default function UploadField({ label, onUploaded }: UploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setFileName(file.name);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Failed to upload file');
      }

      const data = await res.json();

      if (data.success) {
        onUploaded(data.url);
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2 mb-4">
      <label htmlFor="file-upload" className="block font-medium">
        {label}
      </label>
      <input
        id="file-upload"
        type="file"
        onChange={handleFileChange}
        className="w-full"
        disabled={uploading}
      />
      {uploading && <p className="text-blue-500 text-sm">جاري الرفع...</p>}
      {!uploading && fileName && !error && (
        <p className="text-green-600 text-sm">✔ {fileName} تم رفعه</p>
      )}
      {error && <p className="text-red-500 text-sm">✖ {error}</p>}
    </div>
  );
}