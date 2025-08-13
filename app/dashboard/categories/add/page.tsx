'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const AddCategories = () => {
  const router = useRouter();
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });

    if (res.ok) {
      router.push('/dashboard/categories');
    } else {
      alert('Failed to add category');
    }
  };

  return (
    <div className="min-h-12/12 bg-[#0f1419] relative flex flex-col items-center justify-start p-6 rounded-xl">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => router.push('/dashboard/categories')}
        className="absolute top-6 left-6 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm"
      >
        ← Back
      </button>

      {/* Form Card */}
      <div className="bg-[#1B232A] p-6 rounded-2xl shadow-lg w-full max-w-lg mt-6">
        <h2 className="text-xl font-bold text-white mb-6">Add New Category</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Name */}
          <div>
            <label className="block text-sm mb-1 text-gray-300">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 rounded bg-[#12181f] text-white border border-gray-700"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg font-semibold"
          >
            Add Category
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCategories;