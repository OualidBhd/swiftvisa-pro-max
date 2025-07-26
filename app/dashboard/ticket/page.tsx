'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function TicketPage() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [email, setEmail] = useState('');
  const [trackingCode, setTrackingCode] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('trackedApplication');
    if (stored) {
      const app = JSON.parse(stored);
      setEmail(app.email);
      setTrackingCode(app.trackingCode);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) {
      alert('المرجو ملء جميع الحقول الإلزامية.');
      return;
    }

    setLoading(true);

    let attachmentUrl = '';
    if (attachment) {
      const formData = new FormData();
      formData.append('file', attachment);

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const uploadData = await uploadRes.json();
      attachmentUrl = uploadData.url || '';
    }

    const res = await fetch('/api/support-ticket', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        trackingCode,
        subject,
        message,
        attachment: attachmentUrl,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      alert('تم إرسال طلب الدعم بنجاح!');
      setSubject('');
      setMessage('');
      setAttachment(null);
    } else {
      alert('وقع مشكل أثناء الإرسال، جرب مرة أخرى.');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-noise text-black border-2 border-black rounded-2xl shadow-lg p-6 mb-8 text-center"
      >
        <h1 className="text-3xl font-extrabold">💬 طلب دعم</h1>
        <p className="text-gray-700 mt-2">
          إذا كنت تواجه مشكلة، يمكنك إرسال طلب دعم عبر النموذج التالي.
        </p>
      </motion.div>

      {/* Form Section */}
      <motion.section
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-white border-2 border-black rounded-2xl shadow-xl p-6 max-w-3xl mx-auto"
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <FormField
            label="الموضوع"
            type="text"
            value={subject}
            placeholder="مثلاً: خطأ أثناء تحميل الوثائق"
            onChange={(e) => setSubject(e.target.value)}
          />
          <TextAreaField
            label="الرسالة"
            value={message}
            placeholder="اشرح لنا المشكلة بالتفصيل..."
            onChange={(e) => setMessage(e.target.value)}
          />
          <FileField
            label="إرفاق ملف (اختياري)"
            onChange={(e) => setAttachment(e.target.files?.[0] || null)}
          />

          <div className="pt-4 text-right">
            <button
              type="submit"
              disabled={loading}
              className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-6 rounded-full"
            >
              {loading ? 'جارٍ الإرسال...' : 'إرسال'}
            </button>
          </div>
        </form>
      </motion.section>
    </main>
  );
}

function FormField({
  label,
  type,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  type: string;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} className="relative">
      <label className="block font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-3 border-2 border-black rounded bg-gray-50 text-gray-800"
      />
    </motion.div>
  );
}

function TextAreaField({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} className="relative">
      <label className="block font-medium text-gray-700 mb-1">{label}</label>
      <textarea
        rows={5}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-3 border-2 border-black rounded bg-gray-50 text-gray-800"
      />
    </motion.div>
  );
}

function FileField({
  label,
  onChange,
}: {
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} className="relative">
      <label className="block font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="file"
        onChange={onChange}
        className="w-full p-3 border-2 border-black rounded bg-gray-50 text-gray-800"
      />
    </motion.div>
  );
}