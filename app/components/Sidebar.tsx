'use client';

import Link from 'next/link';
import { FaHome, FaUser, FaFolderOpen, FaCreditCard, FaTicketAlt } from 'react-icons/fa';

export default function Sidebar() {
  return (
    <div className="w-64 bg-blue-900 text-white min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-10">SwiftVisa</h2>
      <nav className="space-y-4">
        <Link href="#" className="flex items-center gap-3 hover:text-blue-300"><FaHome /> Dashboard</Link>
        <Link href="#" className="flex items-center gap-3 hover:text-blue-300"><FaUser /> Profile</Link>
        <Link href="#" className="flex items-center gap-3 hover:text-blue-300"><FaFolderOpen /> Storage</Link>
        <Link href="#" className="flex items-center gap-3 hover:text-blue-300"><FaCreditCard /> Payment</Link>
        <Link href="#" className="flex items-center gap-3 hover:text-blue-300"><FaTicketAlt /> Ticket</Link>
      </nav>
    </div>
  );
}