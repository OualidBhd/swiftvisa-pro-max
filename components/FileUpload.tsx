'use client';

import { useState } from 'react';

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setUploadedUrl(data.url);
      } else {
        setErrorMessage('Upload failed: ' + data.error);
      }
      } catch (error) {
        console.error('Upload error:', error);
        setErrorMessage('An error occurred during the upload. Please try again.');
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div className="space-y-4">
      <input type="file" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>

      {uploadedUrl && (
        <div>
          <img src={uploadedUrl} alt="Uploaded" className="w-48 mt-2 rounded" loading="lazy" />
          <img src={uploadedUrl} alt="Uploaded" className="w-48 mt-2 rounded" />
          <img src={uploadedUrl} alt="Uploaded" className="w-48 mt-2 rounded" loading="lazy" />
        </div>
      )}

      {errorMessage && (
        <div className="text-red-500">
          <p>{errorMessage}</p>
        </div>
      )}
    </div>
  );
}