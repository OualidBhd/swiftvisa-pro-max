'use client';


export default function PaymentPage() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">

      <main className="flex-1 p-4 md:p-6">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">Payments</h1>
          <p className="text-gray-600 text-sm md:text-base">
            Review and manage your visa application payments
          </p>
        </header>

        <section className="bg-white rounded-lg shadow p-6 max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold text-[#1F2D5A] mb-4">Payment Details</h2>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Application ID:</span>
              <span>#SWF-2025-0001</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Visa Type:</span>
              <span>Tourist Visa</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Amount:</span>
              <span>$49.99</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Payment Status:</span>
              <span className="text-yellow-600 font-semibold">Pending</span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full">
              Pay Now
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}