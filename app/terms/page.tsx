"use client";

import { theme } from "@/lib/theme";
import { motion } from "framer-motion";

export default function TermsPage() {
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
        <h1 className="text-3xl sm:text-4xl font-extrabold">شروط الاستخدام</h1>
        <p className="mt-2 text-sm sm:text-base text-gray-100">
          نساعدك في تقديم الطلبات لكن لسنا جهة إصدار التأشيرات
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
          title="1. طبيعة الخدمة"
          text="SwiftVisa ليست جهة حكومية ولا تمنح التأشيرات. نحن نقدم خدمات استشارية ومساعدة في تعبئة النماذج وتقديم الطلبات فقط."
        />
        <Section
          title="2. مسؤولية المستخدم"
          text="المستخدم مسؤول عن صحة ودقة المعلومات المقدمة. أي خطأ في المعلومات يمكن أن يؤدي إلى رفض الطلب."
        />
        <Section
          title="3. حدود المسؤولية"
          text="لا تتحمل SwiftVisa أي مسؤولية عن القرارات النهائية الصادرة من الجهات الحكومية أو القنصليات."
        />
        <Section
          title="4. تعديل الشروط"
          text="نحتفظ بالحق في تعديل أو تحديث هذه الشروط في أي وقت دون إشعار مسبق."
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