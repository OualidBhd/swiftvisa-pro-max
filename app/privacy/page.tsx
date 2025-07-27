"use client";

import { theme } from "@/lib/theme";
import { motion } from "framer-motion";

export default function PrivacyPage() {
  return (
    <main
      className="min-h-screen px-6 py-12"
      style={{
        background: `linear-gradient(to bottom right, ${theme.colors.background}, #f8f9fa)`,
        color: theme.colors.text,
        direction: "rtl",
      }}
    >
      {/* Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-xl shadow-md max-w-4xl mx-auto mb-8 p-6 text-center"
        style={{
          backgroundColor: theme.colors.primary,
          color: "#fff",
        }}
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold">سياسة الخصوصية</h1>
        <p className="mt-2 text-sm sm:text-base text-gray-100">
          نوضح لك كيف نحافظ على سرية وحماية بياناتك الشخصية
        </p>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="max-w-4xl mx-auto rounded-lg p-8 text-right"
        style={{
          backgroundColor: "#fff",
          border: `1px solid ${theme.colors.border}`,
          boxShadow: theme.shadows.card,
        }}
      >
        <Section
          title="1. البيانات التي نقوم بجمعها"
          text="نقوم بجمع البيانات التي تقدمها عند تعبئة النماذج مثل الاسم، البريد الإلكتروني، ونسخ من الوثائق المطلوبة."
        />
        <Section
          title="2. استخدام البيانات"
          text="نستخدم بياناتك فقط لمعالجة طلباتك وللتواصل معك، ولا نشاركها مع أي طرف ثالث إلا في الحالات القانونية."
        />
        <Section
          title="3. حماية البيانات"
          text="نتخذ جميع الإجراءات الأمنية لحماية بياناتك من الوصول غير المصرح به."
        />
        <Section
          title="4. تعديل سياسة الخصوصية"
          text="يمكننا تحديث هذه السياسة من وقت لآخر. سيتم إعلامك بأي تغييرات جوهرية عبر البريد الإلكتروني أو الموقع."
        />
      </motion.div>
    </main>
  );
}

function Section({ title, text }: { title: string; text: string }) {
  return (
    <div className="mb-6">
      <h2
        className="text-xl font-semibold mb-2"
        style={{ color: theme.colors.primary }}
      >
        {title}
      </h2>
      <p style={{ color: theme.colors.text }}>{text}</p>
    </div>
  );
}