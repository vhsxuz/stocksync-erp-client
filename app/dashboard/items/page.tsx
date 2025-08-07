'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Pencil, Trash2, Search, Filter } from 'lucide-react';
import debounce from 'lodash.debounce';

type Item = {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  vendorName: string;
  categoryName: string;
};

type Category = {
  id: string;
  name: string;
};

const Items = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pageSize = 10;

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        if (!res.ok) throw new Error('Failed to fetch categories');
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        setError('Failed to load categories');
        console.error(err);
      }
    };

    fetchCategories();
  }, []);

  // Fetch items with debounce
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = new URL('/api/items', window.location.origin);
        url.searchParams.set('page', page.toString());
        url.searchParams.set('limit', pageSize.toString());
        if (search) url.searchParams.set('search', search);
        if (selectedCategory) url.searchParams.set('category', selectedCategory);

        const res = await fetch(url.toString());
        if (!res.ok) throw new Error('Failed to fetch items');
        const data = await res.json();
        setItems(data.items);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError('Failed to load items');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchItems();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [page, search, selectedCategory]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        const res = await fetch(`/api/items/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Delete failed');
        setItems(prev => prev.filter(item => item.id !== id));
      } catch (err) {
        setError('Failed to delete item');
        console.error(err);
      }
    }
  };

  const debouncedSearch = debounce((val: string) => {
    setPage(1);
    setSearch(val);
  }, 500);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPage(1);
    setSelectedCategory(e.target.value);
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Header and Add Item button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white">Items</h2>
        <Link
          href="/dashboard/items/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
        >
          Add Item
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            value={searchInput}
            onChange={handleSearchChange}
            placeholder="Search by name..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="relative w-full md:w-1/4">
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="w-full pl-3 pr-12 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {/* Custom Chevron */}
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <svg
              className="h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-900 text-red-100 rounded-lg">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Desktop Table */}
      {!loading && (
        <>
          <div className="hidden md:block overflow-x-auto rounded-lg shadow border border-gray-800">
            <table className="min-w-full text-sm text-left text-gray-300">
              <thead className="bg-gray-800 text-xs uppercase tracking-wide text-gray-400">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Vendor</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-800">
                {items.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-800 transition">
                    <td className="px-4 py-4">{(page - 1) * pageSize + index + 1}</td>
                    <td className="px-4 py-4 font-medium text-white">{item.name}</td>
                    <td className="px-4 py-4">{item.stock}</td>
                    <td className="px-4 py-4">${item.price.toFixed(2)}</td>
                    <td className="px-4 py-4">{item.vendorName}</td>
                    <td className="px-4 py-4">{item.categoryName}</td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex justify-center items-center gap-3">
                        <Link href={`/dashboard/items/edit/${item.id}`} className="text-blue-500 hover:text-blue-400">
                          <Pencil size={18} />
                        </Link>
                        <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-400">
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
            {items.map((item, index) => (
              <div key={item.id} className="bg-gray-800 rounded-lg p-4 text-gray-200 shadow">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-white">{item.name}</h3>
                  <span className="text-sm text-gray-400">#{(page - 1) * pageSize + index + 1}</span>
                </div>
                <div className="text-sm space-y-1">
                  <p><strong>Stock:</strong> {item.stock}</p>
                  <p><strong>Price:</strong> ${item.price.toFixed(2)}</p>
                  <p><strong>Vendor:</strong> {item.vendorName}</p>
                  <p><strong>Category:</strong> {item.categoryName}</p>
                </div>
                <div className="flex justify-end gap-4 mt-3">
                  <Link href={`/dashboard/items/edit/${item.id}`} className="text-blue-500 hover:text-blue-400">
                    <Pencil size={18} />
                  </Link>
                  <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-400">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6 space-x-4">
            <button
              disabled={page === 1 || loading}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50 hover:bg-gray-600"
            >
              Prev
            </button>
            <span className="px-4 py-2 text-white">Page {page} of {totalPages}</span>
            <button
              disabled={page === totalPages || loading}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50 hover:bg-gray-600"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Items;