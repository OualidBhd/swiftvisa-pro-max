'use client';

import { useState } from 'react';

export default function ApplyPage() {
  const [step, setStep] = useState(1);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData();
    form.append('fullName', formData.fullName);
    form.append('email', formData.email);
    form.append('countryOfOrigin', formData.countryOfOrigin);
    form.append('destinationCountry', formData.destinationCountry);
    form.append('visaType', formData.visaType);
    form.append('travelDate', formData.travelDate);

    if (formData.passportImage) form.append('passportImage', formData.passportImage);
    if (formData.residencePermit) form.append('residencePermit', formData.residencePermit);
    if (formData.personalPhoto) form.append('personalPhoto', formData.personalPhoto);
    if (formData.additionalDocs) form.append('additionalDocs', formData.additionalDocs);

    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        body: form,
      });

      const result = await res.json();

      if (result.success) {
        alert('Application submitted successfully!');
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('Submit Error:', error);
      alert('Something went wrong while submitting the form.');
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6 md:p-12">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Apply for a Visa</h1>
        <p className="text-gray-600 text-base">
          Fill out your visa application in 3 simple steps
        </p>
      </header>

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-extrabold text-center text-[#1F2D5A] mb-6">
              Step 1: Personal & Travel Info
            </h2>

            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full p-3 mb-4 border rounded"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-3 mb-4 border rounded"
              required
            />
            <input
              type="text"
              name="countryOfOrigin"
              value={formData.countryOfOrigin}
              onChange={handleChange}
              placeholder="Country of Origin"
              className="w-full p-3 mb-4 border rounded"
              required
            />
            <input
              type="text"
              name="destinationCountry"
              value={formData.destinationCountry}
              onChange={handleChange}
              placeholder="Destination Country"
              className="w-full p-3 mb-6 border rounded"
              required
            />

            <div className="flex justify-center">
              <button
                type="button"
                onClick={nextStep}
                className="bg-[#D1633C] text-white py-3 px-8 rounded-full font-semibold hover:bg-[#bb5431]"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-extrabold text-center text-[#1F2D5A] mb-6">
              Step 2: Visa Type & Travel Date
            </h2>

            <select
              name="visaType"
              value={formData.visaType}
              onChange={handleChange}
              className="w-full p-3 mb-4 border rounded"
              required
            >
              <option value="">Select Visa Type</option>
              <option value="Tourist Visa">Tourist Visa</option>
              <option value="Business Visa">Business Visa</option>
              <option value="Student Visa">Student Visa</option>
            </select>

            <input
              type="date"
              name="travelDate"
              value={formData.travelDate}
              onChange={handleChange}
              className="w-full p-3 mb-6 border rounded"
              required
            />

            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-400 text-white py-2 px-6 rounded-full hover:bg-gray-500"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="bg-[#D1633C] text-white py-2 px-6 rounded-full hover:bg-[#bb5431]"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-2xl font-extrabold text-center text-[#1F2D5A] mb-6">
              Step 3: Upload Documents
            </h2>

            <div className="space-y-4">
              <label className="block font-semibold text-[#1F2D5A]">Passport Image</label>
              <input type="file" name="passportImage" onChange={handleFileChange} className="w-full p-3 border rounded bg-white" required />

              <label className="block font-semibold text-[#1F2D5A]">Residence Permit</label>
              <input type="file" name="residencePermit" onChange={handleFileChange} className="w-full p-3 border rounded bg-white" required />

              <label className="block font-semibold text-[#1F2D5A]">Personal Photo</label>
              <input type="file" name="personalPhoto" onChange={handleFileChange} className="w-full p-3 border rounded bg-white" required />

              <label className="block font-semibold text-[#1F2D5A]">Additional Documents (Optional)</label>
              <input type="file" name="additionalDocs" onChange={handleFileChange} className="w-full p-3 border rounded bg-white" />
            </div>

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-400 text-white py-2 px-6 rounded-full hover:bg-gray-500"
              >
                Back
              </button>
              <button
                type="submit"
                className="bg-green-600 text-white py-2 px-6 rounded-full font-semibold hover:bg-green-700"
              >
                Send Application
              </button>
            </div>
          </div>
        )}
      </form>
    </main>
  );
}