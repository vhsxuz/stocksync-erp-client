'use client';

import React, { useEffect, useState } from 'react';

interface LatestTransaction {
  id: string;
  totalAmount: number;
  createdAt: string;
}

const HomePage = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [latestTransactions, setLatestTransactions] = useState<LatestTransaction[]>([]);
  const [lowStockItems, setLowStockItems] = useState<{ id: string; name: string; stock: number }[]>([]);

  useEffect(() => {
    fetch('/api/dashboard/summary')
      .then((res) => res.json())
      .then((data) => {
        setTotalRevenue(data.totalRevenue);
        setLatestTransactions(data.latestTransactions);
        setLowStockItems(data.lowStockItems);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-[#0f1419] p-6 text-white">
      <h1 className="text-2xl font-semibold">Dashboard Overview</h1>
      <p className="text-sm text-gray-400 mt-2">Your business at a glance</p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
        <div className="bg-[#1B232A] p-6 rounded-xl shadow-lg">
          <p className="text-gray-400 text-sm">Total Revenue</p>
          <h2 className="text-2xl font-bold mt-2">${totalRevenue.toLocaleString()}</h2>
        </div>
        <div className="bg-[#1B232A] p-6 rounded-xl shadow-lg">
          <p className="text-gray-400 text-sm">Transactions</p>
          <h2 className="text-2xl font-bold mt-2">{latestTransactions.length}</h2>
        </div>
        <div className="bg-[#1B232A] p-6 rounded-xl shadow-lg">
          <p className="text-gray-400 text-sm">Low Stock Items</p>
          <h2 className="text-2xl font-bold mt-2">{lowStockItems.length}</h2>
        </div>
      </div>

      {/* Latest Transactions */}
      <div className="bg-[#1B232A] p-6 rounded-xl shadow-lg mt-8">
        <h3 className="text-lg font-semibold mb-4">Latest Transactions</h3>
        {latestTransactions.length === 0 ? (
          <p className="text-gray-500 text-sm">No transactions yet</p>
        ) : (
          <ul className="divide-y divide-gray-700">
            {latestTransactions.map((tx) => (
              <li key={tx.id} className="py-3 flex justify-between">
                <span>{new Date(tx.createdAt).toLocaleDateString()}</span>
                <span className="font-semibold">${tx.totalAmount.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Low Stock Items */}
      <div className="bg-[#1B232A] p-6 rounded-xl shadow-lg mt-8">
        <h3 className="text-lg font-semibold mb-4">Low Stock Alerts</h3>
        {lowStockItems.length === 0 ? (
          <p className="text-gray-500 text-sm">No low stock items</p>
        ) : (
          <ul className="divide-y divide-gray-700">
            {lowStockItems.map((item) => (
              <li key={item.id} className="py-3 flex justify-between">
                <span>{item.name}</span>
                <span className="text-red-400 font-semibold">{item.stock} left</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default HomePage;