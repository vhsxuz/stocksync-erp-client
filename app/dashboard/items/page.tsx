'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Pencil, Trash2 } from 'lucide-react';

type Item = {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  vendorName: string;
};

const Items = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const fetchItems = async () => {
      const res = await fetch(`/api/items?page=${page}&limit=${pageSize}`);
      const data = await res.json();
      setItems(data.items);
      setTotalPages(data.totalPages);
    };

    fetchItems();
  }, [page]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      await fetch(`/api/items/${id}`, { method: 'DELETE' });
      setItems(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white">Items</h2>
        <Link
          href="/dashboard/items/new"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow"
        >
          Add Item
        </Link>
      </div>

      {/* Table on medium+ screens */}
      <div className="hidden md:block overflow-x-auto rounded-lg shadow border border-gray-800">
        <table className="min-w-full text-sm text-left text-gray-300">
          <thead className="bg-gray-800 text-xs uppercase tracking-wide text-gray-400">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Vendor</th>
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

      {/* Mobile view */}
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
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50 hover:bg-gray-600"
        >
          Prev
        </button>
        <span className="px-4 py-2 text-white">Page {page} of {totalPages}</span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50 hover:bg-gray-600"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Items;
