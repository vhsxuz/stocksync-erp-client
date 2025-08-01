'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LogoIcon from '../LogoIcon';

const RegisterForm = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPw] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    setSuccessMsg('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: username,
          email,
          password,
        }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
      }

      setSuccessMsg('Registered! Please check your email to verify your account.');
      // Optional: redirect after delay
      setTimeout(() => router.push('/auth/login'), 2500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Registration failed');
      } else {
        setError('Registration failed');
      }
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
        <h1 className="font-thin text-4xl mb-2">Create Account</h1>
        <p className="text-sm text-gray-500">Fill in your details to start</p>
      </div>

      {/* fields */}
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

      {/* status messages */}
      {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}
      {successMsg && <p className="mt-4 text-green-600 text-sm">{successMsg}</p>}

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