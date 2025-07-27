"use client";

import { motion } from "framer-motion";
import { theme } from "@/lib/theme";

export default function About() {
  return (
    <main
      style={{
        background: `linear-gradient(to bottom right, ${theme.colors.background}, #f8f9fa)`,
        minHeight: "100vh",
      }}
      className="pt-24 pb-16 px-6"
    >
      {/* العنوان */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-extrabold text-center mb-8"
        style={{ color: theme.colors.primary }}
      >
        من نحن
      </motion.h1>

      {/* النص التعريفي */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-3xl mx-auto text-center mb-12"
        style={{
          backgroundColor: "#fff",
          border: `1px solid ${theme.colors.border}`,
          borderRadius: "12px",
          boxShadow: theme.shadows.card,
          padding: "2rem",
        }}
      >
        <p className="text-lg leading-relaxed mb-4" style={{ color: theme.colors.text }}>
          في <span style={{ color: theme.colors.primary, fontWeight: "bold" }}>SwiftVisa</span>، نحن نساعدك في
          تسهيل عملية التقديم على التأشيرات عن طريق توفير منصة سهلة الاستعمال لملء الطلبات وإدارة الوثائق.
        </p>
        <p className="text-lg leading-relaxed mb-4" style={{ color: theme.colors.text }}>
          مهمتنا هي **مساعدتك على تنظيم مستنداتك بشكل صحيح**، وتتبع حالة طلبك خطوة بخطوة، لكن
          <span style={{ color: theme.colors.secondary, fontWeight: "bold" }}>
            لسنا الجهة التي تمنح أو تصدر التأشيرات
          </span>. قرار قبول أو رفض التأشيرة يرجع فقط إلى السفارات والجهات الرسمية.
        </p>
        <p className="text-lg leading-relaxed" style={{ color: theme.colors.text }}>
          هدفنا هو جعل تجربتك في طلب التأشيرة أبسط وأسرع، مع تقديم إرشادات واضحة لضمان عدم ارتكاب الأخطاء في
          عملية التقديم.
        </p>
      </motion.div>
    </main>
  );
}