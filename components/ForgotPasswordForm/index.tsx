// src/components/forgotPasswordForm.tsx
'use client';

import Image from 'next/image';
import { useState } from 'react';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');

  return (
    <form className="w-full max-w-sm text-black">
      {/* logo */}
      <div className="flex items-center gap-2">
        {/* Embedded SVG Logo */}
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#24C4A8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-6 9 6-9 6-9-6z" />
          <path d="M3 9v6a9 9 0 0 0 9 9" />
          <path d="M21 9v6a9 9 0 0 1-9 9" />
        </svg>
        <span className="text-xl font-bold tracking-tight">StockSync ERP</span>
      </div>



      {/* heading */}
      <div className="text-center mb-10">
        <h1 className="font-thin text-4xl mb-2">Forgot Password</h1>
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
          onChange={e => setEmail(e.target.value)}
          className="mt-2 w-full rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-black"
          required
        />
      </label>

      {/* submit */}
      <button
        type="submit"
        className="mt-8 w-full rounded-md bg-black py-3 text-sm font-medium text-white transition hover:opacity-90"
      >
        Send Reset Link
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