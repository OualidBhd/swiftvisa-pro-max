'use client';

import { useEffect, useState, ReactNode, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  DocumentIcon,
  PhotoIcon,
  PaperClipIcon,
  ArrowUpTrayIcon
} from '@heroicons/react/24/outline';
import { theme } from '@/lib/theme';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

type Application = {
  id: string | number;
  passportImage?: string | null;
  residencePermit?: string | null;
  personalPhoto?: string | null;
  additionalDocs?: string | string[] | null;
  createdAt: string;
};

const MAX_SIZE_BYTES = 10 * 1024 * 1024;
const ACCEPTED = ['image/png','image/jpeg','image/jpg','image/webp','application/pdf'];

export default function StoragePage() {
  const [app, setApp] = useState<Application | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState(0);
  const [msg, setMsg] = useState<{type:'ok'|'err', text:string} | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // جِيب الطلب ديال المستخدم
  async function loadMe() {
    try {
      const res = await fetch('/api/tracking/me', { cache: 'no-store', credentials: 'include' });
      const data = await res.json();
      if (data?.success) setApp(data.application as Application);
      else setApp(null);
    } catch { setApp(null); }
  }

  useEffect(() => { loadMe(); }, []);

  const files = useMemo(() => (app ? buildFileItems(app) : []), [app]);

  function validateFile(file: File) {
    if (!file) return 'الملف غير موجود.';
    if (!ACCEPTED.includes(file.type)) return 'نوع الملف غير مدعوم. يُسمح بالصور أو PDF.';
    if (file.size > MAX_SIZE_BYTES) return 'حجم الملف أكبر من 10MB.';
    return null;
  }

  // إرسال الوثيقة الجديدة (مع progress)
  async function sendNewDocument() {
    if (!pendingFile || sending) return;

    const err = validateFile(pendingFile);
    if (err) return setMsg({type:'err', text: err});

    setSending(true);
    setProgress(0);
    setMsg(null);

    try {
      const fd = new FormData();
      fd.append('file', pendingFile);

      // fetch ما كيطلعش progress بسهولة؛ نستعمل XHR
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/tracking/add-document', true);
      xhr.withCredentials = true;

      const p = new Promise<{success:boolean; url?:string; error?:string}>((resolve, reject) => {
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onload = () => {
          try {
            const data = JSON.parse(xhr.responseText);
            if (xhr.status >= 200 && xhr.status < 300 && data?.success) resolve(data);
            else resolve({success:false, error: data?.error || 'فشل الإرسال'});
          } catch { resolve({success:false, error:'فشل الإرسال'}); }
        };
        xhr.onerror = () => reject(new Error('Network error'));
      });

      xhr.send(fd);
      const result = await p;

      if (!result.success || !result.url) {
        setMsg({type:'err', text: result.error || 'تعذر الإرسال'});
        return;
      }

      // Refresh من الـ API باش نضمن التزامن
      await loadMe();
      setPendingFile(null);
      setProgress(0);
      setMsg({type:'ok', text:'تم إرسال الوثيقة بنجاح! سوف تصلك رسالة تأكيد.'});
    } catch {
      setMsg({type:'err', text:'تعذر الإرسال، حاول مرة أخرى.'});
    } finally {
      setSending(false);
    }
  }

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] || null;
    if (!f) { setPendingFile(null); return; }
    const err = validateFile(f);
    if (err) { setMsg({type:'err', text: err}); setPendingFile(null); return; }
    setMsg(null);
    setPendingFile(f);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (!f) return;
    const err = validateFile(f);
    if (err) { setMsg({type:'err', text: err}); return; }
    setPendingFile(f);
    setMsg(null);
  }

  return (
    <main className="flex-1 min-h-screen"
      style={{ background: `linear-gradient(to bottom right, ${theme.colors.background}, #f8f9fa)` }}>
      {/* Banner */}
      <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="relative rounded-b-3xl shadow-lg"
        style={{ backgroundColor: theme.colors.primary, color: '#fff', borderBottom: `2px solid ${theme.colors.border}` }}>
        <div className="relative p-8 text-center">
          <h1 className="text-4xl font-extrabold">📎 الوثائق المرفقة</h1>
          <p className="mt-2" style={{ color: '#f1f5f9' }}>هنا كيبانو الوثائق ديالك وقدر تزيد وحدة جديدة.</p>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }} className="max-w-5xl mx-auto rounded-2xl p-8 mt-6"
        style={{ backgroundColor: '#fff', border: `1px solid ${theme.colors.border}`, boxShadow: theme.shadows.card }}>

        {msg && (
          <div className={`mb-4 rounded px-3 py-2 text-sm ${msg.type==='ok' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {msg.text}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* الكروت ديال الوثائق الحالية */}
          {files.map((f) => (
            <div key={f.key} className="list-none">
              <FileCard label={f.label} url={f.url} icon={f.icon} />
            </div>
          ))}

          {/* كارت إضافة وثيقة (Drag & Drop + اختيار يدوي) */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`relative p-4 rounded-lg flex flex-col items-center justify-center text-center border-2 border-dashed ${dragOver ? 'bg-blue-50 border-blue-300' : ''}`}
            style={{ borderColor: theme.colors.border, backgroundColor: '#fafafa' }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
          >
            <ArrowUpTrayIcon className="w-8 h-8 mb-2" />
            <p className="font-medium mb-2" style={{ color: theme.colors.textSecondary }}>
              أسقط الملف هنا أو اختر يدوياً
            </p>

            <label className="inline-flex items-center px-3 py-2 rounded border cursor-pointer hover:bg-gray-50 text-black">
  اختر ملف
  <input
    type="file"
    className="hidden"
    accept="image/*,.pdf"
    onChange={onPick}
  />
</label>

            {pendingFile && (
              <p className="text-xs mt-2 max-w-[240px] truncate" title={pendingFile.name}>
                {pendingFile.name}
              </p>
            )}

            {/* Progress */}
            {sending && (
              <div className="w-full mt-3">
                <div className="h-2 bg-gray-200 rounded">
                  <div className="h-2 rounded" style={{ width: `${progress}%`, backgroundColor: theme.colors.primary }} />
                </div>
                <p className="text-xs mt-1 text-gray-500">{progress}%</p>
              </div>
            )}

            <button
              disabled={!pendingFile || sending}
              onClick={sendNewDocument}
              className={`mt-3 px-4 py-2 rounded text-white ${!pendingFile || sending ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
            >
              {sending ? 'جاري الإرسال...' : 'إرسال'}
            </button>
            <p className="mt-2 text-[11px] text-gray-500">الحد الأقصى: 10MB | الصور أو PDF</p>
          </motion.div>
        </div>

        {/* لا توجد وثائق */}
        {!files.length && (
          <p className="text-center mt-6" style={{ color: theme.colors.textSecondary }}>
            لا توجد وثائق مرفقة حالياً.
          </p>
        )}
      </motion.div>
    </main>
  );
}

/* ===== Helpers ===== */

function buildFileItems(app: Application) {
  const extra =
    typeof app.additionalDocs === 'string'
      ? app.additionalDocs.split(',').map((s) => s.trim()).filter(Boolean)
      : Array.isArray(app.additionalDocs)
      ? app.additionalDocs
      : [];

  return [
    { key: `${app.id}-pass`, label: '📄 صورة جواز السفر', url: app.passportImage || '', icon: <DocumentIcon className="w-5 h-5" /> },
    { key: `${app.id}-res`,  label: '📄 بطاقة الإقامة',    url: app.residencePermit || '', icon: <DocumentIcon className="w-5 h-5" /> },
    { key: `${app.id}-pers`, label: '📄 صورة شخصية',       url: app.personalPhoto || '', icon: <PhotoIcon className="w-5 h-5" /> },
    ...extra.map((u, i) => ({
      key: `${app.id}-extra-${i}`, label: '📎 وثيقة إضافية', url: String(u), icon: <PaperClipIcon className="w-5 h-5" />
    })),
  ].filter((x) => !!x.url);
}

function cloudinaryThumb(url: string) {
  try { return url.replace('/image/upload/', '/image/upload/w_480,q_70,c_limit/'); }
  catch { return url; }
}

function FileCard({ label, url, icon }: { label: string; url: string; icon: ReactNode }) {
  const clean = (url.split('/').pop() || '').split('?')[0];
  const isImage = /\.(png|jpe?g|gif|webp)$/i.test(clean);
  const isPdf = /\.pdf$/i.test(clean);

  return (
    <motion.div whileHover={{ scale: 1.02 }} className="relative rounded-lg border shadow-sm bg-white"
      style={{ borderColor: theme.colors.border }}>
      <motion.div
        className="absolute top-2 right-2 w-9 h-9 rounded-full flex items-center justify-center bg-white border"
        style={{ borderColor: theme.colors.border, color: theme.colors.text }}
        animate={{ y: [0, -3, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>
        {icon}
      </motion.div>

      <div className="h-56 w-full p-4 flex items-center justify-center">
        {isImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cloudinaryThumb(url)} alt={label} className="max-h-full max-w-full object-contain" />
        ) : (
          <a href={url} target="_blank" rel="noopener noreferrer"
             className="flex flex-col items-center justify-center text-center" style={{ color: theme.colors.primary }}>
            <DocumentIcon className="w-12 h-12 mb-2 text-gray-500" />
            <span className="text-sm underline">{isPdf ? 'فتح PDF' : 'فتح الوثيقة'}</span>
          </a>
        )}
      </div>
    </motion.div>
  );
}