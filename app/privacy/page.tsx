"use client";

import { theme } from "@/lib/theme";

export default function PrivacyPage() {
  return (
    <main className="max-w-4xl mx-auto p-6 mt-10" style={{ color: theme.colors.text }}>
      <h1 className="text-3xl font-bold mb-4" style={{ color: theme.colors.primary }}>
        سياسة الخصوصية
      </h1>
      <p className="mb-4">
        في SwiftVisa، نأخذ خصوصيتك على محمل الجد. نوضح لك هنا كيفية جمع واستخدام وحماية بياناتك الشخصية.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">1. البيانات التي نقوم بجمعها</h2>
      <p className="mb-4">
        نقوم بجمع البيانات التي تقدمها عند تعبئة النماذج مثل الاسم، البريد الإلكتروني، ونسخ من الوثائق المطلوبة.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">2. استخدام البيانات</h2>
      <p className="mb-4">
        نستخدم بياناتك فقط لمعالجة طلباتك وللتواصل معك، ولا نشاركها مع أي طرف ثالث إلا في الحالات القانونية.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">3. حماية البيانات</h2>
      <p className="mb-4">
        نتخذ جميع الإجراءات الأمنية لحماية بياناتك من الوصول غير المصرح به.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">4. تعديل سياسة الخصوصية</h2>
      <p className="mb-4">
        يمكننا تحديث هذه السياسة من وقت لآخر. سيتم إعلامك بأي تغييرات جوهرية عبر البريد الإلكتروني أو الموقع.
      </p>
    </main>
  );
}