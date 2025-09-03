'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

const EditVendor = () => {
  const router = useRouter();
  const params = useParams();
  const vendorId = params?.id as string;

  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVendor = async () => {
      if (!vendorId) return;
      setLoading(true);
      const res = await fetch(`/api/vendors/${vendorId}`);
      if (res.ok) {
        const v = await res.json();
        setName(v.name || '');
        setContact(v.contact || '');
        setAddress(v.address || '');
      } else if (res.status === 404) {
        alert('Vendor not found');
        router.push('/dashboard/vendors');
      } else if (res.status === 401) {
        router.push('/login');
      } else {
        alert('Failed to load vendor');
      }
      setLoading(false);
    };
    loadVendor();
  }, [vendorId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`/api/vendors/${vendorId}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          contact: contact || null,
          address: address || null,
        }),
      }
    );

    if (res.ok) {
      router.push('/dashboard/vendors');
    } else if (res.status === 401) {
      router.push('/login');
    } else {
      alert('Failed to update vendor');
    }
  };

  return (
    <div className="min-h-12/12 bg-[#0f1419] relative flex flex-col items-center justify-start p-6 rounded-xl">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => router.push('/dashboard/vendors')}
        className="absolute top-6 left-6 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm"
      >
        ← Back
      </button>

      {/* Form Card */}
      <div className="bg-[#1B232A] p-6 rounded-2xl shadow-lg w-full max-w-lg mt-6">
        <h2 className="text-xl font-bold text-white mb-6">Edit Vendor</h2>

        {loading ? (
          <div className="text-gray-300">Loading...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Vendor Name */}
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

            {/* Contact */}
            <div>
              <label className="block text-sm mb-1 text-gray-300">Contact</label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full p-2 rounded bg-[#12181f] text-white border border-gray-700"
                placeholder="Optional"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm mb-1 text-gray-300">Address</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2 rounded bg-[#12181f] text-white border border-gray-700"
                rows={3}
                placeholder="Optional"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg font-semibold"
            >
              Save Changes
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditVendor;


