export default function Home() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col text-gray-900">
      <header className="bg-blue-600 text-white p-4 text-center text-2xl font-bold">
        SwiftVisa
      </header>
      <main className="flex-grow p-8 space-y-16">
        <section className="text-center">
          <h1 className="text-5xl font-extrabold mb-6">Welcome to SwiftVisa</h1>
          <p className="text-xl mb-8">Your fast and friendly way to get eVisas online!</p>
          <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg">
            Start Application
          </button>
        </section>

        <section className="text-center">
          <h2 className="text-4xl font-bold mb-8">How It Works</h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md w-60 font-semibold">Step 1: Choose Your Country</div>
            <div className="bg-white p-6 rounded-lg shadow-md w-60 font-semibold">Step 2: Fill Application</div>
            <div className="bg-white p-6 rounded-lg shadow-md w-60 font-semibold">Step 3: Receive Your eVisa</div>
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-4xl font-bold mb-8">Why Choose SwiftVisa?</h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md w-60 font-semibold">Fast Processing</div>
            <div className="bg-white p-6 rounded-lg shadow-md w-60 font-semibold">Secure Application</div>
            <div className="bg-white p-6 rounded-lg shadow-md w-60 font-semibold">24/7 Support</div>
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-4xl font-bold mb-8">Testimonials</h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md w-60 italic">"SwiftVisa made it so easy!"</div>
            <div className="bg-white p-6 rounded-lg shadow-md w-60 italic">"Super fast and simple process."</div>
            <div className="bg-white p-6 rounded-lg shadow-md w-60 italic">"Highly recommended!"</div>
          </div>
        </section>
      </main>
      <footer className="bg-gray-200 text-center p-4 text-sm text-gray-700">
        &copy; 2025 SwiftVisa. All rights reserved.
      </footer>
    </div>
  )
}