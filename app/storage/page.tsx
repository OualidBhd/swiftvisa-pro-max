'use client';

import Sidebar from '../../components/Sidebar';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface Application {
  id: number;
  passportImage: string;
  residencePermit: string;
  personalPhoto: string;
  additionalDocs?: string | null;
  createdAt: string;
}

export default function StoragePage() {
  const { data: session } = useSession();
  const [files, setFiles] = useState<Application[]>([]);
  const [selectedField, setSelectedField] = useState('');
  const [newFile, setNewFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      fetchFiles();
    }
  }, [session]);

  const fetchFiles = async () => {
    const res = await fetch(`/api/application/${session?.user?.id}`);
    const data = await res.json();
    if (data.success) setFiles(data.applications);
  };

  const uploadFile = async () => {
    if (!newFile || !selectedField) return;
    setLoading(true);

    const uploadForm = new FormData();
    uploadForm.append('file', newFile);
    const uploadRes = await fetch('/api/upload', {
      method: 'POST',
      body: uploadForm,
    });
    const uploadData = await uploadRes.json();

    if (!uploadData?.url) {
      alert('Upload failed');
      setLoading(false);
      return;
    }

    const appId = files[0]?.id;
    const res = await fetch('/api/update-file', {
      method: 'POST',
      body: JSON.stringify({
        applicationId: appId,
        field: selectedField,
        url: uploadData.url,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();
    if (data.success) {
      await fetchFiles();
      alert('File uploaded!');
      setNewFile(null);
      setSelectedField('');
    } else {
      alert('Update failed');
    }

    setLoading(false);
  };

  const deleteFile = async (applicationId: number, field: string) => {
    const res = await fetch('/api/delete-file', {
      method: 'POST',
      body: JSON.stringify({ applicationId, field }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();
    if (data.success) {
      await fetchFiles();
    } else {
      alert('Delete failed');
    }
  };

  const renderFileItem = (
    label: string,
    url: string | null | undefined,
    applicationId: number,
    field: keyof Application
  ) => {
    if (!url) return null;
    const fileName = url.split('/').pop();
    const isImage = /\.(png|jpe?g|gif|webp)$/i.test(fileName || '');

    return (
      <li key={label} className="border p-3 rounded flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <p className="font-semibold text-[#1F2D5A]">{label}</p>
          <button
            onClick={() => deleteFile(applicationId, field)}
            className="text-red-500 text-sm hover:underline"
          >
            Delete
          </button>
        </div>
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
      <Sidebar />
      <main className="flex-1 p-4 md:p-6">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">My Documents</h1>
          <p className="text-gray-600 text-sm md:text-base">
            Manage your uploaded visa documents
          </p>
        </header>

        <section className="bg-white rounded-lg shadow p-6 max-w-3xl mx-auto space-y-6">
          <h3 className="font-semibold text-[#1F2D5A]">Uploaded Files</h3>
          <ul className="space-y-4">
            {files.map((app) => (
              <div key={app.id}>
                {renderFileItem('Passport Image', app.passportImage, app.id, 'passportImage')}
                {renderFileItem('Residence Permit', app.residencePermit, app.id, 'residencePermit')}
                {renderFileItem('Personal Photo', app.personalPhoto, app.id, 'personalPhoto')}
                {renderFileItem('Additional Docs', app.additionalDocs, app.id, 'additionalDocs')}
              </div>
            ))}
          </ul>

          <a
            href="/api/download-all"
            className="inline-block mt-4 text-blue-600 underline text-sm hover:text-blue-800"
            download
          >
            Download All Files as ZIP
          </a>

          <div className="pt-6 border-t mt-6">
            <h4 className="font-semibold mb-2">Upload New Document</h4>
            <select
              className="w-full p-2 mb-2 border rounded"
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
            >
              <option value="">Select File Type</option>
              <option value="passportImage">Passport Image</option>
              <option value="residencePermit">Residence Permit</option>
              <option value="personalPhoto">Personal Photo</option>
              <option value="additionalDocs">Additional Documents</option>
            </select>

            <input
              type="file"
              className="w-full p-2 border rounded mb-2"
              onChange={(e) => setNewFile(e.target.files?.[0] || null)}
            />

            <button
              onClick={uploadFile}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full"
              disabled={loading || !newFile || !selectedField}
            >
              {loading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}