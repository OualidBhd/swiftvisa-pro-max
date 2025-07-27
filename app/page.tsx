"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import heroImg from "@/public/illustrations/hero-visa.png";
import { theme } from "@/lib/theme"; // استيراد theme

const services = [
  { title: "طلبات التأشيرة", desc: "ابدأ طلب التأشيرة بسهولة وسرعة.", icon: "/icons/apply.svg" },
  { title: "تتبع الطلب", desc: "تتبع حالة طلبك في أي وقت.", icon: "/icons/track.svg" },
  { title: "الدعم الفني", desc: "فريقنا ديما هنا يعاونك.", icon: "/icons/support.svg" },
];

// مقالات السفر
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
    title: "أفضل الشواطئ في تايلاند",
    desc: "اكتشف أجمل الشواطئ في تايلاند لقضاء عطلة لا تنسى، مع أفضل النصائح للسفر.",
    date: "مارس 2025",
    image: "/images/thailand.jpg",
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

function ContactForm() {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 rounded-xl w-full max-w-md mx-auto md:mx-0"
      style={{
        backgroundColor: "#fff",
        border: `1px solid ${theme.colors.border}`,
        boxShadow: theme.shadows.card,
      }}
    >
      <h2 className="text-2xl font-bold mb-4 text-center md:text-right" style={{ color: theme.colors.primary }}>
        اتصل بنا
      </h2>
      <input
        type="text"
        placeholder="الاسم الكامل"
        className="w-full p-3 mb-4 rounded bg-gray-50 focus:outline-none focus:ring-2"
        style={{
          border: `1px solid ${theme.colors.border}`,
          color: theme.colors.text,
        }}
        required
      />
      <input
        type="email"
        placeholder="البريد الإلكتروني"
        className="w-full p-3 mb-4 rounded bg-gray-50 focus:outline-none focus:ring-2"
        style={{
          border: `1px solid ${theme.colors.border}`,
          color: theme.colors.text,
        }}
        required
      />
      <textarea
        placeholder="رسالتك"
        rows={4}
        className="w-full p-3 mb-4 rounded bg-gray-50 focus:outline-none focus:ring-2"
        style={{
          border: `1px solid ${theme.colors.border}`,
          color: theme.colors.text,
        }}
        required
      ></textarea>
      <button
        type="submit"
        className="px-6 py-3 rounded-full shadow transition-transform hover:scale-105"
        style={{
          backgroundColor: theme.colors.primary,
          color: "#fff",
          boxShadow: theme.shadows.button,
        }}
      >
        إرسال
      </button>
      {message && <p className="mt-3 text-center" style={{ color: theme.colors.success || "green" }}>{message}</p>}
    </form>
  );
}

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
          <li><Link href="/about" className="hover:underline">من نحن</Link></li>
          <li><a href="#blog" className="hover:underline">المقالات</a></li>
          <li><a href="#contact" className="hover:underline">اتصل بنا</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default function Home() {
  return (
    <main style={{ background: `linear-gradient(to bottom right, ${theme.colors.background}, #f8f9fa)` }}>
      <Navbar />

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-8 pt-32 pb-16 max-w-6xl mx-auto">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-lg"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6" style={{ color: theme.colors.primary }}>
            رحلتك هدفك … أوراقك مسؤوليتنا
          </h1>
          <p className="mb-8 text-lg" style={{ color: theme.colors.text }}>
            قدم طلبك، تتبعه، وتواصل معنا بسهولة من مكان واحد.
          </p>
          <Link
            href="/apply"
            className="px-6 py-3 rounded-full shadow-md transition-transform hover:scale-105"
            style={{
              backgroundColor: theme.colors.primary,
              color: "#fff",
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
        <h2 className="text-3xl font-extrabold text-center mb-10" style={{ color: theme.colors.primary }}>
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
              className="p-6 rounded-xl text-center transition"
              style={{
                backgroundColor: "#fff",
                border: `1px solid ${theme.colors.border}`,
                boxShadow: theme.shadows.card,
              }}
            >
              <Image src={service.icon} alt={`${service.title} Icon`} width={64} height={64} />
              <h3 className="text-xl font-semibold mt-4" style={{ color: theme.colors.primary }}>
                {service.title}
              </h3>
              <p className="mt-2" style={{ color: theme.colors.text }}>{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Blog & Contact Section */}
      <section id="blog" className="py-16 border-t" style={{ borderColor: theme.colors.border }}>
        <h2 className="text-2xl font-extrabold text-center mb-8" style={{ color: theme.colors.primary }}>
          مقالات السفر
        </h2>
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.05 }}
              className="p-4 rounded-lg transition"
              style={{
                backgroundColor: "#fff",
                border: `1px solid ${theme.colors.border}`,
                boxShadow: theme.shadows.card,
              }}
            >
              <Image
                src={post.image}
                alt={post.title}
                width={300}
                height={170}
                className="rounded-md mb-3 object-cover"
              />
              <h3 className="text-lg font-semibold mb-1" style={{ color: theme.colors.primary }}>
                {post.title}
              </h3>
              <p className="text-xs mb-2" style={{ color: theme.colors.textSecondary }}>
                {post.date}
              </p>
              <p className="text-sm mb-3" style={{ color: theme.colors.text }}>
                {post.desc}
              </p>
              <Link
                href="#"
                className="inline-block px-4 py-2 text-xs font-semibold rounded-full"
                style={{
                  backgroundColor: theme.colors.primary,
                  color: "#fff",
                  boxShadow: theme.shadows.button,
                }}
              >
                قراءة المزيد
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-16 max-w-6xl mx-auto px-6 md:flex md:items-start md:justify-between md:gap-8">
        <ContactForm />
      </section>

      {/* Footer */}
      <footer
  className="py-8 px-4"
  style={{
    backgroundColor: theme.colors.backgroundLight || "#f9fafb",
    borderTop: `1px solid ${theme.colors.border}`,
    color: theme.colors.text,
  }}
>
  <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm md:text-base">
    {/* اليمين */}
    <div className="order-3 md:order-1 text-center md:text-right w-full md:w-auto">
      © {new Date().getFullYear()} SwiftVisa. جميع الحقوق محفوظة.
    </div>

    {/* الوسط */}
    <div className="order-1 md:order-2 text-center w-full md:w-auto">
      تواصل معنا:{" "}
      <a
        href="mailto:support@swiftvisaonline.com"
        className="underline hover:opacity-80"
        style={{ color: theme.colors.primary }}
      >
        support@swiftvisaonline.com
      </a>
    </div>

    {/* اليسار */}
    <div className="order-2 md:order-3 flex gap-6 text-center md:text-left w-full md:w-auto justify-center md:justify-end">
      <a href="/terms" className="hover:underline">
        شروط الاستخدام
      </a>
      <a href="/privacy" className="hover:underline">
        سياسة الخصوصية
      </a>
    </div>
  </div>
</footer>
    </main>
  );
}