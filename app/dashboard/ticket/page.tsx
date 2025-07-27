'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { theme } from '@/lib/theme';
import { PaperAirplaneIcon, PaperClipIcon } from '@heroicons/react/24/outline';

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

    // إرسال بيانات التذكرة للإيميل
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
      alert('تم إرسال طلب الدعم بنجاح، تم إرسال رسالة إلى بريدك الإلكتروني.');
      setSubject('');
      setMessage('');
      setAttachment(null);
    } else {
      alert('وقع مشكل أثناء الإرسال، جرب مرة أخرى.');
    }
  };

  return (
    <main className="min-h-screen p-6" style={{ background: `linear-gradient(to bottom right, ${theme.colors.background}, #f8f9fa)` }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative text-black rounded-2xl shadow-lg p-6 mb-8 text-center"
        style={{
          backgroundColor: theme.colors.primary,
          color: '#fff',
          border: `2px solid ${theme.colors.border}`,
        }}
      >
        <h1 className="text-3xl font-extrabold">💬 طلب دعم</h1>
        <p className="mt-2" style={{ color: '#f1f5f9' }}>
          إذا كنت تواجه مشكلة، يمكنك إرسال طلب دعم عبر النموذج التالي.
        </p>
      </motion.div>

      {/* Form Section */}
      <motion.section
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="rounded-2xl shadow-xl p-6 max-w-3xl mx-auto"
        style={{
          backgroundColor: '#fff',
          border: `1px solid ${theme.colors.border}`,
          boxShadow: theme.shadows.card,
        }}
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <FadeField delay={0.1}>
            <FormField
              label="الموضوع"
              type="text"
              value={subject}
              placeholder="مثلاً: خطأ أثناء تحميل الوثائق"
              onChange={(e) => setSubject(e.target.value)}
            />
          </FadeField>

          <FadeField delay={0.2}>
            <TextAreaField
              label="الرسالة"
              value={message}
              placeholder="اشرح لنا المشكلة بالتفصيل..."
              onChange={(e) => setMessage(e.target.value)}
            />
          </FadeField>

          <FadeField delay={0.3}>
            <FileField
              label="إرفاق ملف (اختياري)"
              onChange={(e) => setAttachment(e.target.files?.[0] || null)}
            />
          </FadeField>

          <div className="pt-4 text-right">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 px-6 py-2 rounded-full font-bold transition"
              style={{
                backgroundColor: theme.colors.secondary,
                color: '#000',
                boxShadow: theme.shadows.button,
              }}
            >
              <PaperAirplaneIcon className="w-5 h-5" />
              {loading ? 'جارٍ الإرسال...' : 'إرسال'}
            </button>
          </div>
        </form>
      </motion.section>
    </main>
  );
}

function FadeField({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      {children}
    </motion.div>
  );
}

function FormField({ label, type, value, placeholder, onChange }: { label: string; type: string; value: string; placeholder: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} className="relative">
      <label className="block font-medium mb-1" style={{ color: theme.colors.text }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-3 rounded"
        style={{
          border: `1px solid ${theme.colors.border}`,
          backgroundColor: '#f9fafb',
          color: theme.colors.text,
        }}
      />
    </motion.div>
  );
}

function TextAreaField({ label, value, placeholder, onChange }: { label: string; value: string; placeholder: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; }) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} className="relative">
      <label className="block font-medium mb-1" style={{ color: theme.colors.text }}>
        {label}
      </label>
      <textarea
        rows={5}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-3 rounded"
        style={{
          border: `1px solid ${theme.colors.border}`,
          backgroundColor: '#f9fafb',
          color: theme.colors.text,
        }}
      />
    </motion.div>
  );
}

function FileField({ label, onChange }: { label: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} className="relative">
      <label className="block font-medium mb-1" style={{ color: theme.colors.text }}>
        {label}
      </label>
      <div
        className="flex items-center gap-3 p-3 rounded cursor-pointer"
        style={{
          border: `1px solid ${theme.colors.border}`,
          backgroundColor: '#f9fafb',
        }}
      >
        <PaperClipIcon className="w-5 h-5 text-gray-600" />
        <input type="file" onChange={onChange} className="w-full bg-transparent outline-none" />
      </div>
    </motion.div>
  );
}