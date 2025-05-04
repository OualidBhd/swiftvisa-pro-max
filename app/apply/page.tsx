'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
    passportImage: null as File | null,
    residencePermit: null as File | null,
    personalPhoto: null as File | null,
    additionalDocs: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const { name } = e.target;
      setFormData({ ...formData, [name]: e.target.files[0] });
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: form });
    const data = await res.json();
    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const passportImageUrl = formData.passportImage ? await uploadToCloudinary(formData.passportImage) : '';
      const residencePermitUrl = formData.residencePermit ? await uploadToCloudinary(formData.residencePermit) : '';
      const personalPhotoUrl = formData.personalPhoto ? await uploadToCloudinary(formData.personalPhoto) : '';
      const additionalDocsUrl = formData.additionalDocs ? await uploadToCloudinary(formData.additionalDocs) : '';

      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        countryOfOrigin: formData.countryOfOrigin,
        destinationCountry: formData.destinationCountry,
        visaType: formData.visaType,
        travelDate: formData.travelDate,
        passportImage: passportImageUrl,
        residencePermit: residencePermitUrl,
        personalPhoto: personalPhotoUrl,
        additionalDocs: additionalDocsUrl,
      };

      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.success) {
        const code = result.application.trackingCode;
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-6">
        <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-green-600 mb-4">Application Submitted Successfully!</h2>
          <p className="mb-2 text-gray-700">Your tracking code has been sent to your email.</p>
          <p className="font-mono text-blue-600 text-sm break-all">{trackingCode}</p>
          <button
            onClick={() => router.push('/tracking')}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full"
          >
            Go to Tracking Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6 md:p-12">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Apply for a Visa</h1>
        <p className="text-gray-600 text-base">Fill out your visa application in 3 simple steps</p>
      </header>

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-[#1F2D5A] mb-6 text-center">Step 1: Personal & Travel Info</h2>
            <input name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} className="w-full p-3 mb-4 border rounded" required />
            <input name="email" placeholder="Email" type="email" value={formData.email} onChange={handleChange} className="w-full p-3 mb-4 border rounded" required />
            <input name="countryOfOrigin" placeholder="Country of Origin" value={formData.countryOfOrigin} onChange={handleChange} className="w-full p-3 mb-4 border rounded" required />
            <input name="destinationCountry" placeholder="Destination Country" value={formData.destinationCountry} onChange={handleChange} className="w-full p-3 mb-6 border rounded" required />
            <div className="flex justify-center">
              <button type="button" onClick={nextStep} className="bg-[#D1633C] text-white py-2 px-6 rounded-full hover:bg-[#bb5431]">Continue</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-[#1F2D5A] mb-6 text-center">Step 2: Visa Type & Travel Date</h2>
            <select name="visaType" value={formData.visaType} onChange={handleChange} className="w-full p-3 mb-4 border rounded" required>
              <option value="">Select Visa Type</option>
              <option value="Tourist Visa">Tourist Visa</option>
              <option value="Business Visa">Business Visa</option>
              <option value="Student Visa">Student Visa</option>
            </select>
            <input name="travelDate" type="date" value={formData.travelDate} onChange={handleChange} className="w-full p-3 mb-6 border rounded" required />
            <div className="flex justify-between">
              <button type="button" onClick={prevStep} className="bg-gray-400 text-white py-2 px-6 rounded-full hover:bg-gray-500">Back</button>
              <button type="button" onClick={nextStep} className="bg-[#D1633C] text-white py-2 px-6 rounded-full hover:bg-[#bb5431]">Continue</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold text-[#1F2D5A] mb-6 text-center">Step 3: Upload Documents</h2>
            <div className="space-y-4">
              <label className="block">Passport Image</label>
              <input type="file" name="passportImage" onChange={handleFileChange} className="w-full p-3 border rounded bg-white" required />
              <label className="block">Residence Permit</label>
              <input type="file" name="residencePermit" onChange={handleFileChange} className="w-full p-3 border rounded bg-white" required />
              <label className="block">Personal Photo</label>
              <input type="file" name="personalPhoto" onChange={handleFileChange} className="w-full p-3 border rounded bg-white" required />
              <label className="block">Additional Documents (Optional)</label>
              <input type="file" name="additionalDocs" onChange={handleFileChange} className="w-full p-3 border rounded bg-white" />
            </div>
            <div className="flex justify-between mt-6">
              <button type="button" onClick={prevStep} className="bg-gray-400 text-white py-2 px-6 rounded-full hover:bg-gray-500">Back</button>
              <button type="submit" className="bg-green-600 text-white py-2 px-6 rounded-full hover:bg-green-700">Send Application</button>
            </div>
          </div>
        )}
      </form>
    </main>
  );
}