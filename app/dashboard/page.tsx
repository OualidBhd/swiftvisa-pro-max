'use client';

import Sidebar from '../components/Sidebar';
import ApplicationCard from '../components/ApplicationCard';
import { useEffect } from "react";

export default function Dashboard() {
  useEffect(() => {
    console.log("Vercel Analytics check: dashboard page loaded");
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-4 md:p-6">
        <header className="mb-4 md:mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">Hello, Arash!</h1>
          <p className="text-gray-600 text-sm md:text-base">
            Track and manage your visa applications
          </p>
        </header>

        <section className="mb-6 md:mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-blue-600 mb-3">
            Student Application Process
          </h2>
          <div className="grid grid-cols-5 text-center bg-white rounded-md p-2 md:p-4 shadow-sm text-xs md:text-sm text-gray-700">
            <span>Step 1</span>
            <span>Step 2</span>
            <span>Step 3</span>
            <span>Step 4</span>
            <span>Step 5</span>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <ApplicationCard title="Student Application" status="Filling" progress={60} />
        <ApplicationCard title="Visitor Application" status="Pending" progress={20} />
          <div className="flex items-center justify-center border-2 border-dashed border-blue-300 text-blue-600 rounded-md cursor-pointer hover:bg-blue-50 p-4 text-center text-sm">
            + Add New Application
          </div>
        </section>
      </main>
    </div>
  );
}