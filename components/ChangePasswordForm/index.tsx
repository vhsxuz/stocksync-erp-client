'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const ChangePasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!token) {
      setError('Missing token.');
      return;
    }

    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      if (res.ok) {
        setMessage('Password successfully updated!');
        setTimeout(() => router.push('/auth/login'), 2000);
      } else {
        const text = await res.text();
        setError(text || 'Something went wrong.');
      }
    } catch {
      setError('Something went wrong.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm bg-white p-8 rounded-xl shadow text-black"
    >
      <h1 className="text-2xl font-semibold mb-6">Change Password</h1>

      <label className="block mb-4">
        <span className="text-sm font-medium">New Password</span>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
      </label>

      <label className="block mb-4">
        <span className="text-sm font-medium">Confirm Password</span>
        <input
          type="password"
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="mt-2 w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
      </label>

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
      {message && <p className="text-sm text-green-600 mb-4">{message}</p>}

      <button
        type="submit"
        className="mt-4 w-full rounded-md bg-black py-2 text-sm font-medium text-white transition hover:opacity-90"
      >
        Reset Password
      </button>
    </form>
  );
};

export default ChangePasswordForm;
