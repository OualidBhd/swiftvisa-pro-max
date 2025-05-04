'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  FaBars,
  FaTimes,
  FaHome,
  FaUser,
  FaFolder,
  FaCreditCard,
  FaTicketAlt,
} from 'react-icons/fa';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: <FaHome /> },
  { href: '/profile', label: 'Profile', icon: <FaUser /> },
  { href: '/storage', label: 'Storage', icon: <FaFolder /> },
  { href: '/payment', label: 'Payment', icon: <FaCreditCard /> },
  { href: '/ticket', label: 'Ticket', icon: <FaTicketAlt /> },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setOpen(!open);
  const closeOnMobile = () => {
    if (window.innerWidth < 768) setOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden p-4 bg-blue-800 text-white">
        <button onClick={toggleSidebar} className="p-2 rounded focus:outline-none">
          <FaBars />
        </button>
      </div>

      {/* Overlay when sidebar open on mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
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

        {/* Logo */}
        <h1 className="text-3xl font-bold text-white mb-8">SwiftVisa</h1>

        {/* Navigation */}
        <nav className="space-y-2">
          {navLinks.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              onClick={closeOnMobile}
              className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors duration-200 ${
                pathname === href
                  ? 'bg-white text-blue-800 font-bold'
                  : 'hover:bg-blue-700'
              }`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}