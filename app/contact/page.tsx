"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { EnvelopeIcon, UserIcon, ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/outline";
import { theme } from "@/lib/theme";

export default function ContactPage() {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.");
  };

  return (
    <main
      className="min-h-screen py-16 px-4 flex flex-col items-center justify-center"
      style={{
        background: `linear-gradient(to bottom right, ${theme.colors.background}, #f8f9fa)`,
      }}
    >
      {/* عنوان الصفحة */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1
          className="text-4xl md:text-5xl font-extrabold mb-3"
          style={{ color: theme.colors.primary }}
        >
          تواصل معنا
        </h1>
        <p
          className="text-lg md:text-xl"
          style={{ color: theme.colors.textSecondary }}
        >
          نحن هنا لمساعدتك والإجابة على جميع استفساراتك
        </p>
      </motion.div>

      {/* فورم */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg p-8 rounded-xl shadow-lg"
        style={{
          backgroundColor: "#fff",
          border: `1px solid ${theme.colors.border}`,
          boxShadow: theme.shadows.card,
        }}
      >
        <form onSubmit={handleSubmit}>
          {/* الاسم */}
          <motion.div whileHover={{ scale: 1.02 }} className="relative mb-4">
            <UserIcon className="w-5 h-5 absolute top-3 right-3 text-gray-400" />
            <input
              type="text"
              placeholder="الاسم الكامل"
              className="w-full p-3 pl-10 pr-10 rounded bg-gray-50 focus:outline-none focus:ring-2"
              style={{
                border: `1px solid ${theme.colors.border}`,
                color: theme.colors.text,
              }}
              required
            />
          </motion.div>

          {/* البريد الإلكتروني */}
          <motion.div whileHover={{ scale: 1.02 }} className="relative mb-4">
            <EnvelopeIcon className="w-5 h-5 absolute top-3 right-3 text-gray-400" />
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              className="w-full p-3 pl-10 pr-10 rounded bg-gray-50 focus:outline-none focus:ring-2"
              style={{
                border: `1px solid ${theme.colors.border}`,
                color: theme.colors.text,
              }}
              required
            />
          </motion.div>

          {/* الرسالة */}
          <motion.div whileHover={{ scale: 1.02 }} className="relative mb-4">
            <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5 absolute top-3 right-3 text-gray-400" />
            <textarea
              placeholder="رسالتك"
              rows={4}
              className="w-full p-3 pl-10 pr-10 rounded bg-gray-50 focus:outline-none focus:ring-2"
              style={{
                border: `1px solid ${theme.colors.border}`,
                color: theme.colors.text,
              }}
              required
            ></textarea>
          </motion.div>

          {/* زر الإرسال */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            className="w-full px-6 py-3 rounded-full shadow transition-transform"
            style={{
              backgroundColor: theme.colors.primary,
              color: "#fff",
              boxShadow: theme.shadows.button,
            }}
          >
            إرسال
          </motion.button>
        </form>

        {/* رسالة نجاح */}
        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 text-center font-semibold"
            style={{ color: "green" }}
          >
            {message}
          </motion.p>
        )}
      </motion.div>
    </main>
  );
}