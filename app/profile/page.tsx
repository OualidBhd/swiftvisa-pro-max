'use client';

import Sidebar from '../../components/Sidebar';

export default function ProfilePage() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-4 md:p-6">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">My Profile</h1>
          <p className="text-gray-600 text-sm md:text-base">
            View and update your personal information
          </p>
        </header>

        <section className="bg-white rounded-lg shadow p-6 max-w-3xl mx-auto">
          <form className="space-y-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Arash Karim"
                className="w-full p-3 border rounded bg-gray-50"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="arash@email.com"
                className="w-full p-3 border rounded bg-gray-50"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                placeholder="+212 612 345 678"
                className="w-full p-3 border rounded bg-gray-50"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Country of Residence</label>
              <input
                type="text"
                placeholder="Morocco"
                className="w-full p-3 border rounded bg-gray-50"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Preferred Language</label>
              <select className="w-full p-3 border rounded bg-gray-50">
                <option>English</option>
                <option>Français</option>
                <option>العربية</option>
              </select>
            </div>

            <div className="pt-4 text-right">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full"
              >
                Save Changes
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}