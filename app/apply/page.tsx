'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  MapIcon,
  IdentificationIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import UploadField from '@/components/FileUpload';
import { theme } from '@/lib/theme';

export default function ApplyPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const [trackingCode, setTrackingCode] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    countryOfOrigin: '',
    destinationCountry: '',
    visaType: '',
    travelDate: '',
    passportImage: '',
    residencePermit: '',
    personalPhoto: '',
    additionalDocs: '',
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, files } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files?.[0] ?? '' : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // ✅ التحقق من الحقول الإلزامية
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.countryOfOrigin ||
      !formData.destinationCountry ||
      !formData.visaType ||
      !formData.travelDate ||
      !formData.passportImage ||
      !formData.residencePermit ||
      !formData.personalPhoto
    ) {
      alert('يرجى تعبئة جميع الحقول الإلزامية ورفع الوثائق المطلوبة قبل الإرسال.');
      return;
    }
  
    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      const result = await res.json();
  
      if (!res.ok || !result?.success) {
        console.error('Apply API error:', result);
        alert(result?.error ?? 'حدث خطأ أثناء إرسال الطلب.');
        return;
      }
  
      // ✅ خذ الكود من أي مفتاح متاح
      const code = result?.visaApplication?.trackingCode ?? result?.trackingCode;
  
      if (!code) {
        console.error('Unexpected apply payload:', result);
        alert('تم تقديم الطلب لكن لم يتم استلام رمز التتبع.');
        return;
      }
  
      setTrackingCode(code);
      setSuccess(true);
      localStorage.setItem('tracking_email', formData.email);
      localStorage.setItem('tracking_code', code);
    } catch (error) {
      console.error('Submit Error:', error);
      alert('حدث خطأ أثناء إرسال الطلب.');
    }
  };

  if (success) {
    return (
      <main className="flex items-center justify-center min-h-screen" style={{ backgroundColor: theme.colors.background }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            backgroundColor: '#fff',
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.radius.lg,
            boxShadow: theme.shadows.card,
          }}
          className="p-8 max-w-md text-center"
        >
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'green' }}>
            تم تقديم الطلب بنجاح!
          </h2>
          <p className="mb-2" style={{ color: theme.colors.text }}>تم إرسال رمز التتبع إلى بريدك الإلكتروني:</p>
          <p className="font-mono text-sm break-all" style={{ color: theme.colors.primary }}>{trackingCode}</p>
          <button
            onClick={() => router.push('/tracking')}
            style={{
              backgroundColor: theme.colors.primary,
              boxShadow: theme.shadows.button,
            }}
            className="mt-6 hover:opacity-90 text-white font-bold py-2 px-6 rounded-full"
          >
            الذهاب إلى صفحة التتبع
          </button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="flex-1 min-h-screen" style={{ backgroundColor: theme.colors.background }}>
      {/* Banner */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          backgroundColor: theme.colors.primary,
          color: '#fff',
        }}
        className="relative text-center rounded-b-2xl shadow"
      >
        <div className="p-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold">📝 تقديم طلب التأشيرة</h1>
          <p className="mt-2" style={{ color: '#f0f0f0' }}>املأ البيانات المطلوبة بخطوات بسيطة.</p>
        </div>
      </motion.div>

      {/* Form Content */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        style={{
          backgroundColor: '#fff',
          border: `1px solid ${theme.colors.border}`,
          borderRadius: theme.radius.lg,
          boxShadow: theme.shadows.card,
        }}
        className="max-w-2xl mx-auto p-8 mt-6 space-y-6"
      >
        {/* Steps */}
        <div className="flex justify-between mb-6">
          {['المعلومات الشخصية', 'معلومات التأشيرة', 'الوثائق'].map((label, index) => {
            const current = index + 1 === step;
            const completed = index + 1 < step;
            return (
              <div key={index} className="flex flex-col items-center w-full relative">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{
                    scale: current ? 1.2 : 1,
                    opacity: 1,
                    backgroundColor: current
                      ? theme.colors.primary
                      : completed
                      ? theme.colors.secondary
                      : '#d1d5db',
                  }}
                  transition={{ duration: 0.3 }}
                  className="w-10 h-10 flex items-center justify-center rounded-full font-bold text-white"
                >
                  {index + 1}
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="mt-2 text-xs sm:text-sm"
                  style={{ color: theme.colors.text }}
                >
                  {label}
                </motion.p>

                {index < 2 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: completed ? 1 : 0.5 }}
                    transition={{ duration: 0.4 }}
                    className="absolute top-5 left-full h-1 bg-gray-300"
                    style={{ width: '100%' }}
                  ></motion.div>
                )}
              </div>
            );
          })}
        </div>

        {/* Steps Content with Animation */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <Field label="الاسم الكامل" name="fullName" value={formData.fullName} onChange={handleInput} icon={<UserIcon className="w-5 h-5" />} />
              <Field label="البريد الإلكتروني" name="email" value={formData.email} onChange={handleInput} icon={<EnvelopeIcon className="w-5 h-5" />} />
              <SelectField label="بلد الأصل" name="countryOfOrigin" value={formData.countryOfOrigin} onChange={handleInput} icon={<GlobeAltIcon className="w-5 h-5" />} />
              <SelectField label="بلد الوجهة" name="destinationCountry" value={formData.destinationCountry} onChange={handleInput} icon={<MapIcon className="w-5 h-5" />} />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <SelectVisaType label="نوع التأشيرة" name="visaType" value={formData.visaType} onChange={handleInput} icon={<IdentificationIcon className="w-5 h-5" />} />
              <Field label="تاريخ السفر" name="travelDate" type="date" value={formData.travelDate} onChange={handleInput} icon={<CalendarIcon className="w-5 h-5" />} />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <StyledUploadField label="جواز السفر" onUploaded={(url) => setFormData(prev => ({ ...prev, passportImage: url }))} />
              <StyledUploadField label="بطاقة الإقامة" onUploaded={(url) => setFormData(prev => ({ ...prev, residencePermit: url }))} />
              <StyledUploadField label="الصورة الشخصية" onUploaded={(url) => setFormData(prev => ({ ...prev, personalPhoto: url }))} />
              <StyledUploadField label="وثائق إضافية (اختياري)" onUploaded={(url) => setFormData(prev => ({ ...prev, additionalDocs: url }))} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between pt-4 gap-4 flex-wrap">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              style={{
                backgroundColor: '#fff',
                border: `1px solid ${theme.colors.border}`,
                color: theme.colors.text,
                boxShadow: theme.shadows.button,
              }}
              className="font-bold py-2 px-4 rounded hover:opacity-90 transition"
            >
              رجوع
            </button>
          )}
          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              style={{
                backgroundColor: theme.colors.primary,
                boxShadow: theme.shadows.button,
              }}
              className="text-white font-bold py-2 px-4 rounded hover:opacity-90 transition ml-auto"
            >
              التالي
            </button>
          ) : (
            <button
              type="submit"
              style={{
                backgroundColor: theme.colors.secondary,
                boxShadow: theme.shadows.button,
              }}
              className="text-black font-bold py-2 px-4 rounded hover:opacity-90 transition ml-auto"
            >
              إرسال الطلب
            </button>
          )}
        </div>
      </motion.form>
    </main>
  );
}

function Field({ label, name, value, onChange, type = 'text', icon }: any) {
  return (
    <motion.div whileHover={{ scale: 1.01 }} className="relative bg-white p-4 rounded-lg border hover:shadow-sm" style={{ borderColor: theme.colors.border }}>
      <div className="absolute top-3 right-3 text-gray-500">{icon}</div>
      <label className="font-medium text-sm mb-1 block" style={{ color: theme.colors.text }}>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full mt-1 rounded p-2 focus:outline-none focus:ring"
        style={{
          border: `1px solid ${theme.colors.border}`,
          color: theme.colors.text,
        }}
      />
    </motion.div>
  );
}

function SelectField({ label, name, value, onChange, icon }: any) {
  const options = [
    { label: '🇲🇦 المغرب', value: 'Morocco' },
    { label: '🇩🇿 الجزائر', value: 'Algeria' },
    { label: '🇹🇳 تونس', value: 'Tunisia' },
    { label: '🇪🇬 مصر', value: 'Egypt' },
    { label: '🇸🇦 السعودية', value: 'Saudi Arabia' },
    { label: '🇫🇷 فرنسا', value: 'France' },
    { label: '🇩🇪 ألمانيا', value: 'Germany' },
    { label: '🇪🇸 إسبانيا', value: 'Spain' },
    { label: '🇮🇹 إيطاليا', value: 'Italy' },
    { label: '🇺🇸 الولايات المتحدة', value: 'United States' },
  ];

  return (
    <motion.div whileHover={{ scale: 1.01 }} className="relative bg-white p-4 rounded-lg border hover:shadow-sm" style={{ borderColor: theme.colors.border }}>
      <div className="absolute top-3 right-3 text-gray-500">{icon}</div>
      <label className="font-medium text-sm mb-1 block" style={{ color: theme.colors.text }}>{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full mt-1 rounded p-2 focus:outline-none focus:ring"
        style={{
          border: `1px solid ${theme.colors.border}`,
          color: theme.colors.text,
        }}
      >
        <option value="">اختر</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </motion.div>
  );
}

function SelectVisaType({ label, name, value, onChange, icon }: any) {
  return (
    <motion.div whileHover={{ scale: 1.01 }} className="relative bg-white p-4 rounded-lg border hover:shadow-sm" style={{ borderColor: theme.colors.border }}>
      <div className="absolute top-3 right-3 text-gray-500">{icon}</div>
      <label className="font-medium text-sm mb-1 block" style={{ color: theme.colors.text }}>{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full mt-1 rounded p-2 focus:outline-none focus:ring"
        style={{
          border: `1px solid ${theme.colors.border}`,
          color: theme.colors.text,
        }}
      >
        <option value="">اختر نوع التأشيرة</option>
        <option value="Tourism">تأشيرة سياحة</option>
      </select>
    </motion.div>
  );
}

function StyledUploadField({ label, onUploaded }: { label: string; onUploaded: (url: string) => void }) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="relative bg-white p-4 rounded-lg border hover:shadow-sm"
      style={{ borderColor: theme.colors.border }}
    >
      <label className="font-medium text-sm mb-2 block" style={{ color: theme.colors.text }}>
        {label}
      </label>
      <UploadField
        onUploaded={onUploaded}
        buttonStyle={{
          backgroundColor: theme.colors.primary,
          color: '#fff',
          boxShadow: theme.shadows.button,
        }}
        borderColor={theme.colors.border}
      />
    </motion.div>
  );
}