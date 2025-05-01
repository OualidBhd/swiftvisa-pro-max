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
    if (e.target.files && e.target.files.length > 0) {
      setFormData({ ...formData, passportImage: e.target.files[0] });
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted Data:', formData);
    alert('Application Submitted!');
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-center">Step 1: Personal Information</h2>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full p-2 mb-4 border rounded"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-2 mb-4 border rounded"
              required
            />
            <div className="flex justify-between mt-4">
              <button type="button" onClick={nextStep} className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                Next
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-center">Step 2: Travel Details</h2>
            <input
              type="text"
              name="countryOfOrigin"
              value={formData.countryOfOrigin}
              onChange={handleChange}
              placeholder="Country of Origin"
              className="w-full p-2 mb-4 border rounded"
              required
            />
            <input
              type="text"
              name="destinationCountry"
              value={formData.destinationCountry}
              onChange={handleChange}
              placeholder="Destination Country"
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
            <div className="flex justify-between mt-4">
              <button type="button" onClick={prevStep} className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500">
                Back
              </button>
              <button type="button" onClick={nextStep} className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
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
            <div className="flex justify-between mt-4">
              <button type="button" onClick={prevStep} className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500">
                Back
              </button>
              <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
                Send Application
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}