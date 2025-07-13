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
        const code = result.visaApplication.trackingCode;

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
        <div className="bg-white border border-black rounded-xl shadow-[4px_4px_0px_black] p-6 w-full max-w-md">
          <h2 className="text-2xl font-bold text-green-600 mb-4">تم تقديم الطلب بنجاح!</h2>
          <p className="mb-2 text-gray-700">تم إرسال رمز التتبع إلى بريدك الإلكتروني:</p>
          <p className="font-mono text-blue-600 text-sm break-all">{trackingCode}</p>
          <button
            onClick={() => router.push('/tracking')}
            className="mt-6 bg-white border border-black text-black font-bold py-2 px-6 rounded-full shadow-[2px_2px_0px_black] hover:bg-gray-100 transition"
          >
            الذهاب إلى صفحة التتبع
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyan-50 p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-center text-blue-900 mb-8">Visa Application</h1>

      {/* Progress Bar */}
      <div className="flex justify-between mb-8 relative max-w-xl mx-auto">
  {['المعلومات الشخصية', 'معلومات التأشيرة', 'الوثائق'].map((label, index) => {
    const current = index + 1 === step;
    const completed = index + 1 < step;
    return (
      <div
        key={index}
        className="flex-1 flex flex-col items-center relative z-10 transition-all duration-300 ease-in-out"
      >
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ease-in-out
            ${current ? 'bg-blue-600 text-white scale-110 shadow-lg' :
              completed ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-800'}`}
        >
          {index + 1}
        </div>
        <span
          className={`mt-2 text-xs font-semibold transition-all duration-300 ${
            current || completed ? 'text-gray-800' : 'text-gray-400'
          }`}
        >
          {label}
        </span>
        {index < 2 && (
          <div
            className={`absolute top-5 left-1/2 w-full h-1 transform -translate-x-1/2 z-[-1] transition-all duration-300
              ${step > index + 1
                ? 'bg-gradient-to-r from-green-400 to-green-600'
                : 'bg-gray-300'
              }`}
          ></div>
        )}
      </div>
    );
  })}
</div>

      {/* Form Container */}
      <form
  onSubmit={handleSubmit}
  className="bg-white/70 backdrop-blur-md border border-black/10 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] px-6 py-8 space-y-6 w-full max-w-lg mx-auto"
>
      {step === 1 && (
  <>
    <input
      type="text"
      name="fullName"
      value={formData.fullName}
      onChange={handleInput}
      placeholder="الاسم الكامل"
      className="w-full p-2 border border-black rounded bg-white text-gray-800 placeholder:text-gray-500"
      required
    />
    <input
      type="email"
      name="email"
      value={formData.email}
      onChange={handleInput}
      placeholder="البريد الإلكتروني"
      className="w-full p-2 border border-black rounded bg-white text-gray-800 placeholder:text-gray-500"
      required
    />
    <select
  name="countryOfOrigin"
  value={formData.countryOfOrigin}
  onChange={handleInput}
  className="w-full p-2 border border-black rounded bg-white text-gray-800 placeholder:text-gray-500"
  required
>
  <option value="">اختر بلد الأصل</option>
  <option value="Morocco">🇲🇦 المغرب</option>
  <option value="Algeria">🇩🇿 الجزائر</option>
  <option value="Tunisia">🇹🇳 تونس</option>
  <option value="Egypt">🇪🇬 مصر</option>
  <option value="Saudi Arabia">🇸🇦 السعودية</option>
  <option value="France">🇫🇷 فرنسا</option>
  <option value="Germany">🇩🇪 ألمانيا</option>
  <option value="Spain">🇪🇸 إسبانيا</option>
  <option value="Italy">🇮🇹 إيطاليا</option>
  <option value="United States">🇺🇸 الولايات المتحدة</option>
  <option value="United Kingdom">🇬🇧 المملكة المتحدة</option>
  <option value="Canada">🇨🇦 كندا</option>
  <option value="Turkey">🇹🇷 تركيا</option>
  <option value="UAE">🇦🇪 الإمارات</option>
  <option value="Qatar">🇶🇦 قطر</option>
  <option value="Japan">🇯🇵 اليابان</option>
  <option value="China">🇨🇳 الصين</option>
  <option value="India">🇮🇳 الهند</option>
  <option value="Brazil">🇧🇷 البرازيل</option>
  <option value="South Africa">🇿🇦 جنوب أفريقيا</option>
</select>

    <select
  name="destinationCountry"
  value={formData.destinationCountry}
  onChange={handleInput}
  className="w-full p-2 border border-black rounded bg-white text-gray-800 placeholder:text-gray-500"
  required
>
  <option value="">اختر بلد الوجهة</option>
  <option value="Morocco">🇲🇦 المغرب</option>
  <option value="Algeria">🇩🇿 الجزائر</option>
  <option value="Tunisia">🇹🇳 تونس</option>
  <option value="Egypt">🇪🇬 مصر</option>
  <option value="Saudi Arabia">🇸🇦 السعودية</option>
  <option value="France">🇫🇷 فرنسا</option>
  <option value="Germany">🇩🇪 ألمانيا</option>
  <option value="Spain">🇪🇸 إسبانيا</option>
  <option value="Italy">🇮🇹 إيطاليا</option>
  <option value="United States">🇺🇸 الولايات المتحدة</option>
  <option value="United Kingdom">🇬🇧 المملكة المتحدة</option>
  <option value="Canada">🇨🇦 كندا</option>
  <option value="Turkey">🇹🇷 تركيا</option>
  <option value="UAE">🇦🇪 الإمارات</option>
  <option value="Qatar">🇶🇦 قطر</option>
  <option value="Japan">🇯🇵 اليابان</option>
  <option value="China">🇨🇳 الصين</option>
  <option value="India">🇮🇳 الهند</option>
  <option value="Brazil">🇧🇷 البرازيل</option>
  <option value="South Africa">🇿🇦 جنوب أفريقيا</option>
</select>

  </>
)}
{step === 2 && (
  <>
    <input
      type="text"
      name="visaType"
      value={formData.visaType}
      onChange={handleInput}
      placeholder="نوع التأشيرة"
      className="w-full p-2 border border-black rounded bg-white text-gray-800 placeholder:text-gray-500"
      required
    />
    <input
      type="date"
      name="travelDate"
      value={formData.travelDate}
      onChange={handleInput}
      className="w-full p-2 border border-black rounded bg-white text-gray-800 placeholder:text-gray-500"
      required
    />
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
        <div className="flex justify-between pt-4 gap-4 flex-wrap">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="bg-white border border-black text-black font-bold py-2 px-4 rounded shadow-[2px_2px_0px_black] hover:bg-gray-100 transition"
            >
              رجوع
            </button>
          )}
          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="bg-blue-600 text-white font-bold py-2 px-4 rounded shadow-[2px_2px_0px_black] hover:bg-blue-700 transition ml-auto"
            >
              التالي
            </button>
          ) : (
            <button
              type="submit"
              className="bg-green-600 text-white font-bold py-2 px-4 rounded shadow-[2px_2px_0px_black] hover:bg-green-700 transition ml-auto"
            >
              إرسال الطلب
            </button>
          )}
        </div>
      </form>
    </div>
  );
}