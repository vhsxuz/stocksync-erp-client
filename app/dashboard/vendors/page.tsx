'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Pencil, Trash2, Search } from 'lucide-react';
import debounce from 'lodash.debounce';

type Vendor = {
  id: string;
  name: string;
  contact: string;
  address: string;
  createdAt: string;
};

const Vendors = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch vendors
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await fetch('/api/vendors');
        if (!res.ok) throw new Error('Failed to fetch vendors');
        const data = await res.json();
        setVendors(data);
        setFilteredVendors(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load vendors');
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  // Debounced search
  const debouncedSearch = debounce((val: string) => {
    const lower = val.toLowerCase();
    const filtered = vendors.filter(
      (v) =>
        v.name.toLowerCase().includes(lower) ||
        v.contact.toLowerCase().includes(lower) ||
        v.address.toLowerCase().includes(lower)
    );
    setFilteredVendors(filtered);
  }, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this vendor?')) {
      try {
        const res = await fetch(`/api/vendors/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Delete failed');
        setVendors((prev) => prev.filter((v) => v.id !== id));
        setFilteredVendors((prev) => prev.filter((v) => v.id !== id));
      } catch (err) {
        console.error(err);
        setError('Failed to delete vendor');
      }
    }
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white">Vendors</h2>
        <Link
          href="/dashboard/vendors/add"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
        >
          Add Vendor
        </Link>
      </div>

      {/* Search */}
      <div className="relative w-full md:w-1/3 mb-6">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        <input
          type="text"
          value={searchInput}
          onChange={handleSearchChange}
          placeholder="Search by name, contact, or address..."
          className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-900 text-red-100 rounded-lg">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto rounded-lg shadow border border-gray-800">
            <table className="min-w-full text-sm text-left text-gray-300">
              <thead className="bg-gray-800 text-xs uppercase tracking-wide text-gray-400">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Address</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-800">
                {filteredVendors.map((vendor, index) => (
                  <tr key={vendor.id} className="hover:bg-gray-800 transition">
                    <td className="px-4 py-4">{index + 1}</td>
                    <td className="px-4 py-4 text-white">{vendor.name}</td>
                    <td className="px-4 py-4">{vendor.contact}</td>
                    <td className="px-4 py-4">{vendor.address}</td>
                    <td className="px-4 py-4">
                      {new Date(vendor.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex justify-center items-center gap-3">
                        <Link
                          href={`/dashboard/vendors/edit/${vendor.id}`}
                          className="text-blue-500 hover:text-blue-400"
                        >
                          <Pencil size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(vendor.id)}
                          className="text-red-500 hover:text-red-400"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="md:hidden space-y-4">
            {filteredVendors.map((vendor, index) => (
              <div key={vendor.id} className="bg-gray-800 rounded-lg p-4 text-gray-200 shadow">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-white">{vendor.name}</h3>
                  <span className="text-sm text-gray-400">#{index + 1}</span>
                </div>
                <div className="text-sm space-y-1">
                  <p><strong>Contact:</strong> {vendor.contact}</p>
                  <p><strong>Address:</strong> {vendor.address}</p>
                  <p><strong>Created:</strong> {new Date(vendor.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex justify-end gap-4 mt-3">
                  <Link
                    href={`/dashboard/vendors/edit/${vendor.id}`}
                    className="text-blue-500 hover:text-blue-400"
                  >
                    <Pencil size={18} />
                  </Link>
                  <button
                    onClick={() => handleDelete(vendor.id)}
                    className="text-red-500 hover:text-red-400"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Vendors;