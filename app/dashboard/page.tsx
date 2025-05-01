'use client';

import Sidebar from '../components/Sidebar';
import ApplicationCard from '../components/ApplicationCard';

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Hello, Arash!</h1>
          <p className="text-gray-600">Track and manage your visa applications</p>
        </header>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-blue-600 mb-3">Student Application Process</h2>
          <div className="flex justify-between bg-white rounded-md p-4 shadow-sm text-sm font-medium text-gray-700">
            <span>Step 1</span>
            <span>Step 2</span>
            <span>Step 3</span>
            <span>Step 4</span>
            <span>Step 5</span>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ApplicationCard title="Student Application" status="Filling" percent={65} />
          <ApplicationCard title="Visitor Application" status="Pending" percent={30} />
          <div className="flex items-center justify-center border-2 border-dashed border-blue-400 p-4 rounded-lg cursor-pointer hover:bg-blue-50 text-blue-600 font-semibold">
            + Add New Application
          </div>
        </section>
      </main>
    </div>
  );
}