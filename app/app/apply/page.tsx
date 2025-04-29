'use client';

import { useState } from 'react';

export default function ApplicationForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    countryOfOrigin: '',
    destinationCountry: '',
    travelDate: '',
    passportImage: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, passportImage: e.target.files[0] });
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted data:', formData);
    alert('Application Submitted!');
    // هنا تقدر تزيد إرسال البيانات لسيرفر أو تخزينهم
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-center">Step 1: Personal Information</h2>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-2 mb-4 border rounded"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 mb-4 border rounded"
              required
            />
            <button type="button" onClick={nextStep} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-center">Step 2: Travel Information</h2>
            <input
              type="text"
              name="countryOfOrigin"
              placeholder="Country of Origin"
              value={formData.countryOfOrigin}
              onChange={handleChange}
              className="w-full p-2 mb-4 border rounded"
              required
            />
            <input
              type="text"
              name="destinationCountry"
              placeholder="Destination Country"
              value={formData.destinationCountry}
              onChange={handleChange}
              className="w-full p-2 mb-4 border rounded"
              required
            />
            <input
              type="date"
              name="travelDate"
              value={formData.travelDate}
              onChange={handleChange}
              className="w-full p-2 mb-4 border rounded"
              required
            />
            <div className="flex justify-between">
              <button type="button" onClick={prevStep} className="bg-gray-400 text-white p-2 rounded hover:bg-gray-500">
                Back
              </button>
              <button type="button" onClick={nextStep} className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                Next
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-center">Step 3: Passport Upload (Optional)</h2>
            <input
              type="file"
              name="passportImage"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 mb-4 border rounded"
            />
            <div className="flex justify-between mb-4">
              <button type="button" onClick={prevStep} className="bg-gray-400 text-white p-2 rounded hover:bg-gray-500">
                Back
              </button>
              <button type="submit" className="bg-green-600 text-white p-2 rounded hover:bg-green-700">
                Send Application
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}