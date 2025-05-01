'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/apply');
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col text-gray-900">
      <header className="bg-blue-600 text-white p-4 text-center text-2xl font-bold">
        SwiftVisa
      </header>

      <main className="flex-grow p-8 space-y-16">
        <section className="text-center">
          <h1 className="text-5xl font-extrabold mb-6">Welcome to SwiftVisa</h1>
          <p className="text-xl mb-8">Your fast and friendly way to get eVisas online!</p>

          <button
            onClick={handleClick}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg"
          >
            Start Application
          </button>
        </section>
      </main>

      <footer className="bg-gray-200 text-center p-4 text-sm text-gray-700">
        &copy; 2025 SwiftVisa. All rights reserved.
      </footer>
    </div>
  );
}