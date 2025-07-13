'use client';

import { useState, useEffect } from 'react';

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
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <main className="flex-1 p-4 md:p-6">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">💬 طلب دعم</h1>
          <p className="text-gray-600 text-sm md:text-base">
            إذا كنت تواجه مشكلة، يمكنك إرسال طلب دعم عبر النموذج التالي.
          </p>
        </header>

        <section className="bg-white rounded-lg shadow p-6 max-w-3xl mx-auto">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block font-medium text-gray-700 mb-1">الموضوع</label>
              <input
                type="text"
                className="w-full p-3 border rounded bg-gray-50"
                placeholder="مثلاً: خطأ أثناء تحميل الوثائق"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">الرسالة</label>
              <textarea
                rows={5}
                className="w-full p-3 border rounded bg-gray-50"
                placeholder="اشرح لنا المشكلة بالتفصيل..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">إرفاق ملف (اختياري)</label>
              <input
                type="file"
                className="w-full p-3 border rounded bg-gray-50"
                onChange={(e) => setAttachment(e.target.files?.[0] || null)}
              />
            </div>

            <div className="pt-4 text-right">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full"
              >
                {loading ? 'جارٍ الإرسال...' : 'إرسال'}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}