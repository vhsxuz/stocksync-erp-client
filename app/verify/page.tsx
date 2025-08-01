'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const email = searchParams.get('email');
    if (!email) {
      router.replace('/login');
      return;
    }

    fetch(`/api/auth/verify?email=${email}`)
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(() => {
        setStatus('success');
        setTimeout(() => router.replace('/auth/login'), 2000);
      })
      .catch(() => {
        setStatus('error');
        setTimeout(() => router.replace('/auth/login'), 3000);
      });
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-[#0F172A] text-white px-4">
      <div className="max-w-md w-full bg-white/5 backdrop-blur-md p-8 rounded-2xl shadow-xl text-center">
        <h1 className="text-3xl font-semibold text-gradient bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
          StockSync ERP
        </h1>

        <div className="mt-6">
          {status === 'loading' && (
            <>
              <p className="text-gray-300 text-lg font-medium">Verifying your account...</p>
              <div className="mt-4 w-8 h-8 mx-auto border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            </>
          )}

          {status === 'success' && (
            <p className="text-green-400 text-lg font-medium">
              ✅ Email verified! Redirecting to login...
            </p>
          )}

          {status === 'error' && (
            <p className="text-red-400 text-lg font-medium">
              ❌ Verification failed. Redirecting...
            </p>
          )}
        </div>

        <p className="mt-6 text-sm text-gray-500">
          &copy; {new Date().getFullYear()} StockSync ERP
        </p>
      </div>
    </div>
  );
}