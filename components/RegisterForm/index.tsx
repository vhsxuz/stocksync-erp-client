// src/components/registerForm.tsx
'use client';

import Image from 'next/image';
import { useState } from 'react';
import LogoIcon from '../LogoIcon';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPw] = useState('');

  return (
    <form className="w-full max-w-sm text-black">
      {/* logo */}
      <div className="flex justify-center mb-10">
        <div className="flex items-center gap-2">
          <LogoIcon />
          <span className="text-lg font-bold tracking-tight">StockSync ERP</span>
        </div>
      </div>

      {/* heading */}
      <div className="text-center mb-10">
        <h1 className="font-thin text-4xl mb-2">Create Account</h1>
        <p className="text-sm text-gray-500">
          Fill in your details to start learning
        </p>
      </div>

      {/* ───── row 1 : username | email ───── */}
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium">Username</span>
          <input
            type="text"
            placeholder="Choose a username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="mt-2 w-full rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-black"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Email</span>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="mt-2 w-full rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-black"
            required
          />
        </label>
      </div>

      {/* ───── row 2 : password | confirm ───── */}
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium">Password</span>
          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="mt-2 w-full rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-black"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Confirm Password</span>
          <input
            type="password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={e => setConfirmPw(e.target.value)}
            className="mt-2 w-full rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-black"
            required
          />
        </label>
      </div>

      {/* submit */}
      <button
        type="submit"
        className="mt-8 w-full rounded-md bg-black py-3 text-sm font-medium text-white transition hover:opacity-90"
      >
        Sign Up
      </button>

      {/* footer */}
      <p className="mt-8 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <a href="/auth/login" className="font-medium text-black hover:underline">
          Sign In
        </a>
      </p>
    </form>
  );
};

export default RegisterForm;
