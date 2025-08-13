'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AddItem = () => {
  const router = useRouter();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [vendorId, setVendorId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('/api/vendors')
      .then((res) => res.json())
      .then((data) => setVendors(data));

    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock, 10),
        vendorId,
        categoryId: categoryId || null,
      }),
    });

    if (res.ok) {
      router.push('/dashboard/items');
    } else {
      alert('Failed to add item');
    }
  };

  return (
    <div className="min-h-[160px] bg-[#0f1419] relative flex flex-col items-center justify-start p-6 rounded-xl">
      {/* Back Button - fixed at top left */}
      <button
        type="button"
        onClick={() => router.push('/dashboard/items')}
        className="absolute top-6 left-6 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm"
      >
        ←  Back
      </button>

      {/* Form Card */}
      <div className="bg-[#1B232A] p-6 rounded-2xl shadow-lg w-full max-w-lg mt-6">
        <h2 className="text-xl font-bold text-white mb-6">Add New Item</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div>
            <label className="block text-sm mb-1 text-gray-300">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 rounded bg-[#12181f] text-white border border-gray-700"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 text-gray-300">Price</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-2 rounded bg-[#12181f] text-white border border-gray-700"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-300">Stock</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full p-2 rounded bg-[#12181f] text-white border border-gray-700"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-300">Vendor</label>
            <select
              value={vendorId}
              onChange={(e) => setVendorId(e.target.value)}
              className="w-full p-2 rounded bg-[#12181f] text-white border border-gray-700"
              required
            >
              <option value="">Select Vendor</option>
              {vendors.map((vendor: any) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-300">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full p-2 rounded bg-[#12181f] text-white border border-gray-700"
            >
              <option value="">Select Category (optional)</option>
              {categories.map((category: any) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg font-semibold"
          >
            Add Item
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddItem;