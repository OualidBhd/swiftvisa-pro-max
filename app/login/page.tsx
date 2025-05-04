'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await signIn('google');
    } catch (err) {
      setError('Login failed. Please try again.');
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Checking session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white p-6">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-md w-full text-center">
        {status === 'authenticated' ? (
          <>
            <h1 className="text-2xl font-bold text-green-600 mb-2">
              Welcome, {session?.user?.name || 'User'}!
            </h1>
            <p className="text-gray-500">Redirecting to your dashboard...</p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-[#1F2D5A] mb-4">Login to SwiftVisa</h1>
            <p className="text-gray-600 mb-6">Sign in to manage your visa applications</p>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <button
              onClick={handleLogin}
              disabled={loading}
              className={`w-full py-3 rounded-full font-semibold transition ${
                loading
                  ? 'bg-blue-300 cursor-not-allowed'
                  : 'bg-[#1F2D5A] hover:bg-[#16234a] text-white'
              }`}
            >
              {loading ? 'Signing in...' : 'Sign in with Google'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}