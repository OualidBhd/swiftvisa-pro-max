'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ArrowPathIcon, PlusIcon } from '@heroicons/react/24/outline';
import Sidebar from '@/components/Sidebar';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [appData, setAppData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      if (session?.user?.role === 'ADMIN') {
        router.push('/admin'); // إذا بغيتي تدخلو للأدمين
      } else {
        router.push('/dashboard');
      }
    }
  }, [session, status]);

  useEffect(() => {
    const fetchUserApplications = async () => {
      if (status !== 'authenticated' || !session?.user?.id) return;

      try {
        const res = await fetch(`/api/applications/${session.user.id}`);
        const data = await res.json();
        if (data.success && data.applications.length > 0) {
          setAppData(data.applications[0]);
        }
      } catch (err) {
        console.error('Error fetching user applications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserApplications();
  }, [session, status]);

  const goToApply = () => {
    router.push('/apply');
  };

  if (loading || status === 'loading') {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gray-50">
        <ArrowPathIcon className="w-8 h-8 text-blue-600 animate-spin" />
        <span className="ml-2 text-sm text-gray-600">Loading dashboard...</span>
      </main>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-[#1F2D5A]">Your Visa Application</h1>
            <button
              onClick={goToApply}
              className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-sm font-medium"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add New Application
            </button>
          </div>

          {appData ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-sm">
              <div>
                <p className="font-medium text-gray-600">Full Name</p>
                <p>{appData.fullName}</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">Email</p>
                <p>{appData.email}</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">Visa Type</p>
                <p>{appData.visaType}</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">Travel Date</p>
                <p>{new Date(appData.travelDate).toLocaleDateString()}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="font-medium text-gray-600">Status</p>
                <p className="font-semibold text-yellow-600">Under Review</p>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500">No application found. Please submit one.</p>
          )}
        </div>
      </main>
    </div>
  );
}