'use client';

import { useState } from 'react';
import LogoIcon from '@/components/LogoIcon';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setMessage('Reset link sent! Please check your email.');
      } else {
        const text = await res.text();
        setError(text || 'Something went wrong');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm text-black">
      {/* logo */}
      <div className="flex justify-center mb-10">
        <div className="flex items-center gap-2">
          <LogoIcon />
          <span className="text-lg font-bold tracking-tight">StockSync ERP</span>
        </div>
      </div>

      {/* heading */}
      <div className="text-center mb-10">
        <h1 className="font-light text-4xl mb-2">Forgot Password</h1>
        <p className="text-sm text-gray-500">
          Enter your email and we&apos;ll send you a reset link
        </p>
      </div>

      {/* email input */}
      <label className="block">
        <span className="text-sm font-medium">Email</span>
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-black"
          required
        />
      </label>

      {/* message */}
      {message && (
        <p className="mt-4 text-sm text-green-600 text-center">{message}</p>
      )}
      {error && (
        <p className="mt-4 text-sm text-red-600 text-center">{error}</p>
      )}

      {/* submit */}
      <button
        type="submit"
        disabled={loading}
        className="mt-8 w-full rounded-md bg-black py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {loading ? 'Sending...' : 'Send Reset Link'}
      </button>

      {/* footer link */}
      <p className="mt-8 text-center text-sm text-gray-500">
        Remembered your password?{' '}
        <a href="/auth/login" className="font-medium text-black hover:underline">
          Sign In
        </a>
      </p>
    </form>
  );
};

export default ForgotPasswordForm;