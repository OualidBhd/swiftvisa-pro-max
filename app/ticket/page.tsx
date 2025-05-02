'use client';

import Sidebar from '../components/Sidebar';

export default function TicketPage() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-4 md:p-6">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">Support Tickets</h1>
          <p className="text-gray-600 text-sm md:text-base">
            Need help? Submit a support request below.
          </p>
        </header>

        <section className="bg-white rounded-lg shadow p-6 max-w-3xl mx-auto">
          <form className="space-y-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Subject</label>
              <input type="text" className="w-full p-3 border rounded bg-gray-50" placeholder="e.g. Problem with application" />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Message</label>
              <textarea
                rows={5}
                className="w-full p-3 border rounded bg-gray-50"
                placeholder="Describe your issue in detail..."
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Attach File (Optional)</label>
              <input type="file" className="w-full p-3 border rounded bg-gray-50" />
            </div>

            <div className="pt-4 text-right">
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full">
                Submit Ticket
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}