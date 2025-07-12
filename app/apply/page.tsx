'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import UploadField from '@/components/FileUpload';

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
    const target = e.target;
    const { name, value, type, files } = target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files?.[0] ?? '' : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.passportImage || !formData.residencePermit || !formData.personalPhoto) {
      alert('يرجى رفع جميع الوثائق الإلزامية قبل الإرسال.');
      return;
    }

    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (result.success) {
        const code = result.VisaApplication.trackingCode;

        // إرسال الإيميل بعد النجاح
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: formData.email,
            subject: 'رمز تتبع طلبك',
            text: `شكراً على تقديم طلبك لدى SwiftVisa.\n\nرمز تتبع الطلب الخاص بك هو: ${code}\n\nيمكنك تتبع حالة الطلب عبر صفحة التتبع.`,
          }),
        });

        setTrackingCode(code);
        setSuccess(true);
        localStorage.setItem('tracking_email', formData.email);
        localStorage.setItem('tracking_code', code);
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('Submit Error:', error);
      alert('Something went wrong while submitting the form.');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-cyan-50 text-center p-6">
        <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-green-600 mb-4">تم تقديم الطلب بنجاح!</h2>
          <p className="mb-2 text-gray-700">تم إرسال رمز التتبع إلى بريدك الإلكتروني:</p>
          <p className="font-mono text-blue-600 text-sm break-all">{trackingCode}</p>
          <button
            onClick={() => router.push('/tracking')}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full"
          >
            الذهاب إلى صفحة التتبع
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyan-50 p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Visa Application</h1>

      {/* Progress Bar */}
      <div className="flex justify-between mb-8 relative max-w-xl mx-auto">
        {['المعلومات الشخصية', 'معلومات التأشيرة', 'الوثائق'].map((label, index) => {
          const current = index + 1 === step;
          const completed = index + 1 < step;
          return (
            <div key={index} className="flex-1 flex flex-col items-center relative z-10">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition
                ${current ? 'bg-blue-600 text-white' :
                  completed ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-800'}`}>
                {index + 1}
              </div>
              <span className="mt-2 text-xs text-center">{label}</span>
              {index < 2 && (
                <div className={`absolute top-5 left-1/2 w-full h-1 transform -translate-x-1/2 z-[-1]
                  ${step > index + 1 ? 'bg-green-500' : 'bg-gray-300'}`}>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md space-y-4 max-w-xl mx-auto">
        {/* Step 1 */}
        {step === 1 && (
          <>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleInput}
              placeholder="الاسم الكامل" className="w-full p-2 border rounded bg-white" required />
            <input type="email" name="email" value={formData.email} onChange={handleInput}
              placeholder="البريد الإلكتروني" className="w-full p-2 border rounded bg-white" required />
            <input type="text" name="countryOfOrigin" value={formData.countryOfOrigin} onChange={handleInput}
              placeholder="بلد الأصل" className="w-full p-2 border rounded bg-white" required />
            <input type="text" name="destinationCountry" value={formData.destinationCountry} onChange={handleInput}
              placeholder="بلد الوجهة" className="w-full p-2 border rounded bg-white" required />
          </>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <>
            <input type="text" name="visaType" value={formData.visaType} onChange={handleInput}
              placeholder="نوع التأشيرة" className="w-full p-2 border rounded bg-white" required />
            <input type="date" name="travelDate" value={formData.travelDate} onChange={handleInput}
              className="w-full p-2 border rounded bg-white" required />
          </>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <>
            <UploadField label="جواز السفر" onUploaded={(url) => setFormData(prev => ({ ...prev, passportImage: url }))} />
            <UploadField label="بطاقة الإقامة" onUploaded={(url) => setFormData(prev => ({ ...prev, residencePermit: url }))} />
            <UploadField label="الصورة الشخصية" onUploaded={(url) => setFormData(prev => ({ ...prev, personalPhoto: url }))} />
            <UploadField label="وثائق إضافية (اختياري)" onUploaded={(url) => setFormData(prev => ({ ...prev, additionalDocs: url }))} />
          </>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          {step > 1 && (
            <button type="button" onClick={() => setStep(step - 1)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded">
              رجوع
            </button>
          )}
          {step < 3 ? (
            <button type="button" onClick={() => setStep(step + 1)}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded ml-auto">
              التالي
            </button>
          ) : (
            <button type="submit"
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded ml-auto">
              إرسال الطلب
            </button>
          )}
        </div>
      </form>
    </div>
  );
}