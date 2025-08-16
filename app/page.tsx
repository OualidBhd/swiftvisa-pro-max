"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import heroImg from "@/public/illustrations/hero-visa.png";
import { theme } from "@/lib/theme";

const services = [
  {
    title: "طلبات التأشيرة",
    desc: "ابدأ طلب التأشيرة بسهولة وسرعة.",
    icon: "/illustrations/apply.png",
    href: "/apply",
  },
  {
    title: "تتبع الطلب",
    desc: "تتبع حالة طلبك في أي وقت.",
    icon: "/illustrations/track.png",
    href: "/tracking",
  },
  {
    title: "الدعم الفني",
    desc: "فريقنا ديما هنا يعاونك.",
    icon: "/illustrations/support.png",
    href: "/contact",
  },
];

const blogPosts = [
  {
    title: "أفضل الوجهات السياحية في اليابان",
    desc: "اكتشف أجمل المدن اليابانية، من طوكيو العصرية إلى كيوتو التاريخية، ونصائح للسفر هناك.",
    date: "يناير 2025",
    image: "/images/japan.jpg",
  },
  {
    title: "دليلك للحصول على تأشيرة شينغن",
    desc: "كل ما تحتاج معرفته للحصول على تأشيرة شينغن بسهولة وبخطوات بسيطة.",
    date: "فبراير 2025",
    image: "/images/schengen.jpg",
  },
  {
    title: "نصائح السفر إلى تركيا",
    desc: "أهم النصائح التي تحتاجها لاكتشاف تركيا وتخطيط رحلتك بشكل مثالي.",
    date: "مارس 2025",
    image: "/images/turkey.jpg",
  },
];

// Animation Variants
const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.5 },
  }),
};

function Navbar() {
  return (
    <header
      className="py-4 fixed top-0 w-full z-50"
      style={{
        backgroundColor: "#fff",
        borderBottom: `1px solid ${theme.colors.border}`,
        boxShadow: theme.shadows.navbar,
      }}
    >
      <nav className="max-w-6xl mx-auto px-4 flex justify-between items-center">
        <h1 className="text-2xl font-extrabold" style={{ color: theme.colors.primary }}>
          SwiftVisa
        </h1>
        <ul className="flex space-x-6" style={{ color: theme.colors.text }}>
          <li><a href="#services" className="hover:underline">الخدمات</a></li>
          <li><a href="#blog" className="hover:underline">المقالات</a></li>
          <li><a href="/contact" className="hover:underline">اتصل بنا</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default function Home() {
  return (
    <main
      style={{
        background: `linear-gradient(to bottom right, ${theme.colors.background}, #f8f9fa)`,
      }}
    >
      <Navbar />

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-8 pt-32 pb-16 max-w-6xl mx-auto">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-lg text-center md:text-right"
        >
          <h1
            className="text-4xl md:text-5xl font-extrabold mb-6"
            style={{ color: theme.colors.primary }}
          >
            رحلتك هدفك … أوراقك مسؤوليتنا
          </h1>
          <p className="mb-8 text-lg" style={{ color: theme.colors.text }}>
            قدم طلبك، تتبعه، وتواصل معنا بسهولة من مكان واحد.
          </p>
          <Link
            href="/apply"
            className="px-7 py-4 rounded-full shadow-md transition-transform transform hover:scale-105"
            style={{
              backgroundColor: "#2e7d32", // اللون الأخضر
              color: "#fff",
              fontWeight: "bold",
              fontSize: "1rem",
              boxShadow: theme.shadows.button,
            }}
          >
            قدّم طلبك الآن
          </Link>
        </motion.div>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          className="mt-10 md:mt-0"
        >
          <Image
            src={heroImg}
            alt="Visa Illustration"
            width={420}
            height={320}
            priority
            className="drop-shadow-md"
          />
        </motion.div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 max-w-6xl mx-auto px-8">
        <h2
          className="text-3xl font-extrabold text-center mb-10"
          style={{ color: theme.colors.primary }}
        >
          خدماتنا
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.05 }}
              className="p-6 rounded-xl text-center transition h-full flex flex-col justify-between"
              style={{
                backgroundColor: "#fff",
                border: `1px solid ${theme.colors.border}`,
                boxShadow: theme.shadows.card,
              }}
            >
              <div>
                <Image
                  src={service.icon}
                  alt={`${service.title} Icon`}
                  width={64}
                  height={64}
                  className="mx-auto mb-3"
                />
                <h3 className="text-xl font-semibold mt-4" style={{ color: theme.colors.primary }}>
                  {service.title}
                </h3>
                <p className="mt-2" style={{ color: theme.colors.text }}>{service.desc}</p>
              </div>
              <Link
                href={service.href}
                className="px-4 py-2 mt-4 rounded-full text-sm font-semibold shadow-md transition-all duration-300 transform hover:scale-105"
                style={{
                  backgroundColor: theme.colors.primary,
                  color: "#fff",
                  boxShadow: theme.shadows.button,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e1c759")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = theme.colors.primary)}
              >
                اكتشف الآن
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Blog Section */}
      <section
        id="blog"
        className="py-16 border-t"
        style={{ borderColor: theme.colors.border }}
      >
        <h2
          className="text-2xl font-extrabold text-center mb-8"
          style={{ color: theme.colors.primary }}
        >
          مقالات السفر
        </h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto px-6">
          {blogPosts.map((post, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.05 }}
              className="p-4 rounded-lg transition h-full flex flex-col justify-between"
              style={{
                backgroundColor: "#fff",
                border: `1px solid ${theme.colors.border}`,
                boxShadow: theme.shadows.card,
              }}
            >
              <div>
                <Image
                  src={post.image}
                  alt={post.title}
                  width={300}
                  height={160}
                  className="rounded-md mb-3 object-cover mx-auto"
                />
                <h3 className="text-lg font-semibold mb-1 text-center" style={{ color: theme.colors.primary }}>
                  {post.title}
                </h3>
                <p className="text-xs mb-2 text-center" style={{ color: theme.colors.textSecondary }}>
                  {post.date}
                </p>
                <p className="text-sm mb-3 text-center" style={{ color: theme.colors.text }}>
                  {post.desc}
                </p>
              </div>
              <Link
                href="#"
                className="inline-block px-4 py-2 text-xs font-semibold rounded-full mx-auto transition-all duration-300 transform hover:scale-105"
                style={{
                  backgroundColor: theme.colors.primary,
                  color: "#fff",
                  boxShadow: theme.shadows.button,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e1c759")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = theme.colors.primary)}
              >
                قراءة المزيد
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-6 text-center"
        style={{
          backgroundColor: theme.colors.backgroundLight || "#f9fafb",
          borderTop: `1px solid ${theme.colors.border}`,
          color: theme.colors.text,
        }}
      >
        <p>© {new Date().getFullYear()} SwiftVisa. All rights reserved.</p>
        <p className="mt-2">
          Contact us at:{" "}
          <a
            href="mailto:support@swiftvisaonline.com"
            className="underline"
            style={{ color: theme.colors.primary }}
          >
            contact@swiftvisaonline.com
          </a>
        </p>
      </footer>
    </main>
  );
}