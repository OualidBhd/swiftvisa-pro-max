'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  FaBars,
  FaTimes,
  FaHome,
  FaUser,
  FaFolder,
  FaCreditCard,
  FaTicketAlt,
} from 'react-icons/fa';

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const toggleSidebar = () => setOpen(!open);
  const closeOnMobile = () => {
    if (window.innerWidth < 768) setOpen(false);
  };

  const handleDashboardClick = () => {
    const trackingCode = localStorage.getItem('tracking_code');
    if (trackingCode) {
      router.push(`/dashboard?code=${trackingCode}`);
      closeOnMobile();
    } else {
      alert('لم يتم العثور على كود التتبع. يرجى تقديم الطلب أو تتبعه أولاً.');
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden p-4 bg-blue-800 text-white">
        <button onClick={toggleSidebar} className="p-2 rounded focus:outline-none">
          <FaBars />
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`
          ${open ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0
          transition-transform duration-300
          fixed md:relative top-0 left-0 z-50
          w-64 bg-blue-800 text-white h-full p-6 space-y-6 overflow-y-auto
        `}
      >
        {/* Close button on mobile */}
        <div className="md:hidden flex justify-end">
          <button onClick={toggleSidebar} className="text-white focus:outline-none">
            <FaTimes size={20} />
          </button>
        </div>

        <h1 className="text-3xl font-bold text-white mb-8">SwiftVisa</h1>

        <nav className="space-y-2">
          <button
            onClick={handleDashboardClick}
            className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors duration-200 w-full text-left ${
              pathname.startsWith('/dashboard') ? 'bg-white text-blue-800 font-bold' : 'hover:bg-blue-700'
            }`}
          >
            <FaHome />
            <span>Dashboard</span>
          </button>

          <Link
            href="/profile"
            onClick={closeOnMobile}
            className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors duration-200 ${
              pathname === '/profile' ? 'bg-white text-blue-800 font-bold' : 'hover:bg-blue-700'
            }`}
          >
            <FaUser />
            <span>Profile</span>
          </Link>

          <Link
            href="/storage"
            onClick={closeOnMobile}
            className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors duration-200 ${
              pathname === '/storage' ? 'bg-white text-blue-800 font-bold' : 'hover:bg-blue-700'
            }`}
          >
            <FaFolder />
            <span>Storage</span>
          </Link>

          <Link
            href="/payment"
            onClick={closeOnMobile}
            className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors duration-200 ${
              pathname === '/payment' ? 'bg-white text-blue-800 font-bold' : 'hover:bg-blue-700'
            }`}
          >
            <FaCreditCard />
            <span>Payment</span>
          </Link>

          <Link
            href="/ticket"
            onClick={closeOnMobile}
            className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors duration-200 ${
              pathname === '/ticket' ? 'bg-white text-blue-800 font-bold' : 'hover:bg-blue-700'
            }`}
          >
            <FaTicketAlt />
            <span>Ticket</span>
          </Link>
        </nav>
      </aside>
    </>
  );
}