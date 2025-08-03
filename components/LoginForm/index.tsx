'use client';

import Image from 'next/image';
import { useState } from 'react';
import LogoIcon from '../LogoIcon';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      // ✅ force reload so middleware can access the cookie
      window.location.href = '/dashboard/home';
    } else {
      const text = await res.text();
      setError(text || 'Login failed');
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
      <div className="text-center mb-8">
        <h1 className="font-thin text-4xl mb-2">Welcome&nbsp;Back</h1>
        <p className="text-sm text-gray-500">
          Enter your email and password to access your account
        </p>
      </div>

      {/* error */}
      {error && (
        <div className="mb-4 text-sm text-red-600 text-center">{error}</div>
      )}

      <label className="block">
        <span className="text-sm font-medium">Email</span>
        <input
          type="text"
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="mt-2 w-full rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-black"
          required
        />
      </label>

      <label className="mt-6 block">
        <span className="text-sm font-medium">Password</span>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="mt-2 w-full rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-black"
          required
        />
      </label>

      <div className="mt-4 flex items-center justify-between text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-black focus:ring-0"
          />
          Remember me
        </label>
        <a href="/auth/forgot" className="font-medium text-black hover:underline">
          Forgot Password
        </a>
      </div>

      <button
        type="submit"
        className="mt-8 w-full rounded-md bg-black py-3 text-sm font-medium text-white transition hover:opacity-90"
      >
        Sign In
      </button>

      <div className="relative my-6 h-px bg-gray-200">
        <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-xs text-gray-400">
          or
        </span>
      </div>

      <button
        type="button"
        className="flex w-full items-center justify-center gap-3 rounded-md border border-gray-200 bg-white py-3 text-sm font-medium transition hover:bg-gray-50"
      >
        <Image
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          width={18}
          height={18}
        />
        Sign In with Google
      </button>

      <p className="mt-8 text-center text-sm text-gray-500">
        Don&apos;t have an account?{' '}
        <a href="/auth/register" className="font-medium text-black hover:underline">
          Sign Up
        </a>
      </p>
    </form>
  );
};

export default LoginForm;