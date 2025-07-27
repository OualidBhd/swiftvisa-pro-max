"use client";

import { theme } from "@/lib/theme";

export default function TermsPage() {
  return (
    <main className="max-w-4xl mx-auto p-6 mt-10" style={{ color: theme.colors.text }}>
      <h1 className="text-3xl font-bold mb-4" style={{ color: theme.colors.primary }}>
        شروط الاستخدام
      </h1>
      <p className="mb-4">
        مرحباً بك في SwiftVisa. باستخدامك لموقعنا أو خدماتنا، فإنك توافق على الالتزام بشروط الاستخدام التالية.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">1. طبيعة الخدمة</h2>
      <p className="mb-4">
        SwiftVisa ليست جهة حكومية ولا تمنح التأشيرات. نحن نقدم خدمات استشارية ومساعدة في تعبئة النماذج
        وتقديم الطلبات فقط.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">2. مسؤولية المستخدم</h2>
      <p className="mb-4">
        المستخدم مسؤول عن صحة ودقة المعلومات المقدمة. أي خطأ في المعلومات يمكن أن يؤدي إلى رفض الطلب.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">3. حدود المسؤولية</h2>
      <p className="mb-4">
        لا تتحمل SwiftVisa أي مسؤولية عن القرارات النهائية الصادرة من الجهات الحكومية أو القنصليات.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">4. تعديل الشروط</h2>
      <p className="mb-4">
        نحتفظ بالحق في تعديل أو تحديث هذه الشروط في أي وقت دون إشعار مسبق.
      </p>
    </main>
  );
}