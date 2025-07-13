// app/dashboard/layout.tsx
import Sidebar from '@/components/Sidebar';
import type { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}