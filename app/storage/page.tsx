'use client';

import Sidebar from '../components/Sidebar';

export default function StoragePage() {
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
          <div className="space-y-2">
            <h3 className="font-semibold text-[#1F2D5A]">Uploaded Files</h3>
            <ul className="space-y-2">
              <li className="flex justify-between items-center border p-3 rounded">
                <span>passport.pdf</span>
                <button className="text-red-500 hover:underline text-sm">Delete</button>
              </li>
              <li className="flex justify-between items-center border p-3 rounded">
                <span>photo.jpg</span>
                <button className="text-red-500 hover:underline text-sm">Delete</button>
              </li>
            </ul>
          </div>

          <div className="pt-4">
            <label className="block font-medium text-gray-700 mb-2">Upload New Document</label>
            <input type="file" className="w-full p-3 border rounded bg-gray-50" />
            <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full">
              Upload
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}