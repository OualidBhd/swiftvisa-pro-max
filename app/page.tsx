'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/apply');
  };

  return (
    <div className="bg-white text-gray-900">
      {/* Header */}
      <header className="flex justify-between items-center p-6 shadow-sm">
        <div className="text-xl font-bold flex items-center gap-2">
          <span className="text-blue-800">🌐</span>
          <span>SwiftVisa</span>
        </div>
        <nav className="hidden md:flex space-x-6 font-medium">
          <a href="#" className="hover:text-blue-600">Home</a>
          <a href="#about" className="hover:text-blue-600">About</a>
          <a href="/apply" className="hover:text-blue-600">Apply for Visa</a>
          <a href="#faq" className="hover:text-blue-600">FAQ</a>
          <a href="#contact" className="hover:text-blue-600">Contact Us</a>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="px-6 py-12 md:py-20 text-center max-w-5xl mx-auto">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-10">
          <div className="text-left md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-blue-900 leading-tight">
              Simplify Your Travel. <br />
              Apply for Your Visa Online Today!
            </h1>
            <button
              onClick={handleClick}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg"
            >
              Start Application
            </button>
          </div>
          <div className="md:w-1/2">
            <Image
              src="/images/hero-visa.png" // تأكد من وضع الصورة داخل public/images
              alt="Visa Application Illustration"
              width={400}
              height={400}
              className="mx-auto"
            />
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20 text-center">
          <div>
            <span className="text-3xl">🌍</span>
            <h4 className="font-semibold mt-2">100+ Visas</h4>
          </div>
          <div>
            <span className="text-3xl">🔒</span>
            <h4 className="font-semibold mt-2">Secure Payment</h4>
          </div>
          <div>
            <span className="text-3xl">⏰</span>
            <h4 className="font-semibold mt-2">24/7 Support</h4>
          </div>
        </div>

        {/* How It Works */}
        <section className="mt-24" id="about">
          <h2 className="text-3xl font-bold mb-10">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <span className="text-4xl">📝</span>
              <h3 className="font-semibold mt-2">1. Fill Out</h3>
              <p className="text-sm text-gray-600">Online Application</p>
            </div>
            <div>
              <span className="text-4xl">📤</span>
              <h3 className="font-semibold mt-2">2. Submit</h3>
              <p className="text-sm text-gray-600">Documents</p>
            </div>
            <div>
              <span className="text-4xl">💳</span>
              <h3 className="font-semibold mt-2">3. Make Payment</h3>
            </div>
            <div>
              <span className="text-4xl">✅</span>
              <h3 className="font-semibold mt-2">4. Receive Visa</h3>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 p-6 mt-20 text-center text-sm text-gray-600" id="contact">
        <p>&copy; 2025 SwiftVisa. All rights reserved.</p>
        <div className="mt-2">
          <span>📧 contact@swiftvisa.com</span> | 
          <span className="ml-2">📍 San Francisco, USA</span>
        </div>
      </footer>
    </div>
  );
}