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

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: <FaHome /> },
    { href: '/profile', label: 'Profile', icon: <FaUser /> },
    { href: '/storage', label: 'Storage', icon: <FaFolder /> },
    { href: '/payment', label: 'Payment', icon: <FaCreditCard /> },
    { href: '/ticket', label: 'Ticket', icon: <FaTicketAlt /> },
  ];

  const handleLinkClick = () => {
    if (window.innerWidth < 768) setOpen(false);
  };

  return (
    <>
      <div className="md:hidden p-4 bg-blue-800 text-white">
        <button onClick={() => setOpen(true)} className="p-2 rounded">
          <FaBars />
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`
          ${open ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0
          transition-transform duration-300
          fixed md:relative top-0 left-0 z-50
          w-64 bg-blue-800 text-white h-full p-6 space-y-4 overflow-y-auto
        `}
      >
        <div className="md:hidden flex justify-end mb-4">
          <button onClick={() => setOpen(false)} className="text-white">
            <FaTimes size={20} />
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-6">SwiftVisa</h2>

        <nav className="space-y-2">
          {links.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              onClick={handleLinkClick}
              className={`flex items-center gap-2 p-2 rounded hover:bg-blue-700 ${
                pathname === href ? 'bg-blue-700 font-semibold' : ''
              }`}
            >
              {icon}
              {label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}