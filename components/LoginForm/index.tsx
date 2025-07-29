// src/components/loginForm.tsx
'use client';

import Image from 'next/image';
import { useState } from 'react';
import LogoIcon from '../LogoIcon';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <form className="w-full max-w-sm text-black">
      {/* logo */}
      <div className="flex justify-center mb-10">
        <div className="flex items-center gap-2">
          {/* Embedded SVG Logo */}
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

      {/* email */}
      <label className="block">
        <span className="text-sm font-medium">Username</span>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="mt-2 w-full rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-black"
          required
        />
      </label>

      {/* password */}
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

      {/* options row */}
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

      {/* sign‑in button */}
      <button
        type="submit"
        className="mt-8 w-full rounded-md bg-black py-3 text-sm font-medium text-white transition hover:opacity-90"
      >
        Sign In
      </button>

      {/* divider */}
      <div className="relative my-6 h-px bg-gray-200">
        <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-xs text-gray-400">
          or
        </span>
      </div>

      {/* Sign in with Google */}
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

      {/* footer link */}
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
