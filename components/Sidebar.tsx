'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const toggleSidebar = () => setOpen(!open);
  const closeOnMobile = () => {
    if (isMobile) setOpen(false);
  };

  // Responsiveness
  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  // Navigate Dashboard
  const handleDashboardClick = () => {
    const trackingCode = localStorage.getItem('tracking_code');
    if (trackingCode) {
      router.push(`/dashboard?code=${trackingCode}`);
      closeOnMobile();
    } else {
      alert('لم يتم العثور على كود التتبع. يرجى تقديم الطلب أو تتبعه أولاً.');
    }
  };

  // Logout (يمسح الجلسة ويحوّل للهوم)
  const handleLogout = async () => {
    try {
      await fetch('/api/tracking/session', { method: 'DELETE' }); // مسح الكوكي
    } catch {}
    try {
      localStorage.removeItem('tracking_code');
      localStorage.removeItem('trackingEmail');
      localStorage.removeItem('trackingCode');
    } catch {}
    closeOnMobile();
    router.push('/');
  };

  const activeColor = '#f4b400'; // لون الخلفية للأكتيف
  const iconActiveColor = '#e1c759'; // لون أيقونة الأكتيف

  const linkClass = (active: boolean) =>
    `relative flex items-center gap-3 px-4 py-2 rounded-lg border transition-all duration-200 w-full text-left shadow-sm overflow-hidden
    ${
      active
        ? `text-black font-bold border-gray-300`
        : 'bg-white text-gray-800 border-gray-200 hover:bg-yellow-50'
    }`;

  const navLinks = [
    { name: 'الرئيسية', path: '/dashboard', icon: <FaHome /> },
    { name: 'الملف الشخصي', path: '/dashboard/profile', icon: <FaUser /> },
    { name: 'المرفقات', path: '/dashboard/storage', icon: <FaFolder /> },
    { name: 'الدفع', path: '/dashboard/payment', icon: <FaCreditCard /> },
    { name: 'تذكرة الدعم', path: '/dashboard/ticket', icon: <FaTicketAlt /> },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <div className="p-4 bg-sky-500 text-white shadow-md flex justify-between items-center">
          <button onClick={toggleSidebar} className="p-2 rounded focus:outline-none">
            <FaBars size={20} />
          </button>
        </div>
      )}

      {/* Overlay on Mobile */}
      {open && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          ${open || !isMobile ? 'translate-x-0' : '-translate-x-full'} 
          transition-transform duration-300
          fixed md:relative top-0 left-0 z-50
          w-64 bg-sky-100 text-black h-screen p-6 space-y-6 border-r border-gray-300 shadow-lg flex flex-col justify-between
        `}
      >
        <div>
          {/* Logo Placeholder */}
          <div className="mb-10 flex justify-center">
            {/* هنا مستقبلاً دير <Image src="/logo.png" width={120} height={40} alt="Logo" /> */}
            <div className="w-28 h-10 bg-gray-300 rounded" />
          </div>

          {/* Links */}
          <nav className="space-y-2 relative">
            {navLinks.map((link) => {
              const active =
                pathname === link.path ||
                (link.path !== '/dashboard' && pathname.startsWith(link.path));

              const iconColor = active ? iconActiveColor : '#555';

              return link.name === 'الرئيسية' ? (
                <button
                  key={link.name}
                  onClick={handleDashboardClick}
                  className={linkClass(active)}
                >
                  {active && (
                    <motion.div
                      layoutId="active-link"
                      className="absolute inset-0 rounded-lg z-[-1]"
                      style={{ backgroundColor: activeColor }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    />
                  )}
                  <motion.span
                    style={{ color: iconColor }}
                    animate={active ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.5, repeat: active ? Infinity : 0 }}
                  >
                    {link.icon}
                  </motion.span>
                  <span>{link.name}</span>
                </button>
              ) : (
                <Link
                  key={link.name}
                  href={link.path}
                  onClick={closeOnMobile}
                  className={linkClass(active)}
                >
                  {active && (
                    <motion.div
                      layoutId="active-link"
                      className="absolute inset-0 rounded-lg z-[-1]"
                      style={{ backgroundColor: activeColor }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    />
                  )}
                  <motion.span
                    style={{ color: iconColor }}
                    animate={active ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.5, repeat: active ? Infinity : 0 }}
                  >
                    {link.icon}
                  </motion.span>
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* زرّ الخروج بالأحمر في القاع */}
        <div className="pt-4 border-t border-gray-300">
          <button
            onClick={handleLogout}
            className="w-full rounded-lg px-4 py-2 text-sm font-semibold bg-red-600 text-white hover:bg-red-700 active:bg-red-800 transition-colors"
          >
            خروج
          </button>
        </div>
      </aside>
    </>
  );
}