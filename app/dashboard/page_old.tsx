'use client';

import { useState } from 'react';

export default function Dashboard() {
  const [formData, setFormData] = useState({
    passport: null as File | null,
    residenceCard: null as File | null,
    personalPhoto: null as File | null,
    additionalDocuments: null as File | null,
    travelDate: '',
  });

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({ ...formData, [field]: e.target.files[0] });
    }
  };

  const handleChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, travelDate: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted Data:', formData);
    alert('Your information has been saved!');
  };

  return (
    <div className="min-h-screen bg-blue-50 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">Your Visa Application Dashboard</h1>

        <div className="mb-4">
          <p className="text-gray-600">Application Status: <span className="font-semibold text-yellow-600">Pending</span></p>
          <p className="text-gray-600">Payment Status: <span className="font-semibold text-red-600">Unpaid</span></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Passport Upload */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Passport Scan (Required)</label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => handleChangeFile(e, 'passport')}
              required
              className="block w-full border p-2 rounded"
            />
            <p className="text-sm text-gray-500 mt-1">Please upload a clear scan of your valid passport.</p>
          </div>

          {/* Residence Card Upload */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Residence Card (Required)</label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => handleChangeFile(e, 'residenceCard')}
              required
              className="block w-full border p-2 rounded"
            />
            <p className="text-sm text-gray-500 mt-1">Upload your residence permit if required.</p>
          </div>

          {/* Personal Photo Upload */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Personal Photo (Required)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleChangeFile(e, 'personalPhoto')}
              required
              className="block w-full border p-2 rounded"
            />
            <p className="text-sm text-gray-500 mt-1">Upload a recent passport-sized photo.</p>
          </div>

          {/* Additional Documents (Optional) */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Additional Documents (Optional)</label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => handleChangeFile(e, 'additionalDocuments')}
              className="block w-full border p-2 rounded"
            />
            <p className="text-sm text-gray-500 mt-1">Optional: upload your flight ticket, hotel booking, or any other supporting documents.</p>
          </div>

          {/* Travel Date */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Travel Date (Required)</label>
            <input
              type="date"
              value={formData.travelDate}
              onChange={handleChangeDate}
              required
              className="block w-full border p-2 rounded"
            />
            <p className="text-sm text-gray-500 mt-1">Select your intended travel date.</p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            Save and Continue
          </button>

          {/* Logout */}
          <div className="text-center mt-4">
            <button className="text-red-500 hover:underline text-sm">Logout</button>
          </div>
        </form>
      </div>
    </div>
  );
}