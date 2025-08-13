'use client';

import React, { useEffect, useState } from 'react';
import { TrendingUp, CreditCard, AlertTriangle } from 'lucide-react';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface LatestTransaction {
  id: string;
  totalAmount: number;
  createdAt: string;
}

export default function HomePage() {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [latestTransactions, setLatestTransactions] = useState<LatestTransaction[]>([]);
  const [lowStockItems, setLowStockItems] = useState<{ id: string; name: string; stock: number }[]>([]);
  const [revenueTrend, setRevenueTrend] = useState<{ date: string; revenue: number }[]>([]);

  useEffect(() => {
    fetch('/api/dashboard/summary')
      .then((res) => res.json())
      .then((data) => {
        setTotalRevenue(data.totalRevenue);
        setLatestTransactions(data.latestTransactions);
        setLowStockItems(data.lowStockItems);

        // Mock trend data for the chart
        setRevenueTrend(
          data.latestTransactions.map((tx: LatestTransaction) => ({
            date: new Date(tx.createdAt).toLocaleDateString(),
            revenue: tx.totalAmount,
          }))
        );
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-[#0f1419] p-6 text-white rounded-xl">
      <h1 className="text-2xl font-semibold">Dashboard Overview</h1>
      <p className="text-sm text-gray-400 mt-2">Your business at a glance</p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
        <div className="bg-[#1B232A] p-6 rounded-xl shadow-lg flex items-center gap-4">
          <div className="bg-green-900 p-3 rounded-lg">
            <TrendingUp size={24} className="text-green-400" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total Revenue</p>
            <h2 className="text-2xl font-bold mt-1">${totalRevenue.toLocaleString()}</h2>
          </div>
        </div>

        <div className="bg-[#1B232A] p-6 rounded-xl shadow-lg flex items-center gap-4">
          <div className="bg-blue-900 p-3 rounded-lg">
            <CreditCard size={24} className="text-blue-400" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Transactions</p>
            <h2 className="text-2xl font-bold mt-1">{latestTransactions.length}</h2>
          </div>
        </div>

        <div className="bg-[#1B232A] p-6 rounded-xl shadow-lg flex items-center gap-4">
          <div className="bg-red-900 p-3 rounded-lg">
            <AlertTriangle size={24} className="text-red-400" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Low Stock Items</p>
            <h2 className="text-2xl font-bold mt-1">{lowStockItems.length}</h2>
          </div>
        </div>
      </div>

      {/* Revenue Trend Chart */}
      <div className="bg-[#1B232A] p-6 rounded-xl shadow-lg mt-8">
        <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
        {revenueTrend.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2f36" />
              <XAxis dataKey="date" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ backgroundColor: '#1B232A', border: 'none' }} />
              <Line type="monotone" dataKey="revenue" stroke="#5ED5A8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-sm">No data available</p>
        )}
      </div>

      {/* Latest Transactions */}
      <div className="bg-[#1B232A] p-6 rounded-xl shadow-lg mt-8">
        <h3 className="text-lg font-semibold mb-4">Latest Transactions</h3>
        {latestTransactions.length === 0 ? (
          <p className="text-gray-500 text-sm">No transactions yet</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400">
                <th className="text-left pb-2">Date</th>
                <th className="text-right pb-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {latestTransactions.map((tx) => (
                <tr key={tx.id} className="border-t border-gray-700">
                  <td className="py-2">{new Date(tx.createdAt).toLocaleDateString()}</td>
                  <td className="text-right font-semibold">${tx.totalAmount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Low Stock Items */}
      <div className="bg-[#1B232A] p-6 rounded-xl shadow-lg mt-8">
        <h3 className="text-lg font-semibold mb-4">Low Stock Alerts</h3>
        {lowStockItems.length === 0 ? (
          <p className="text-gray-500 text-sm">No low stock items</p>
        ) : (
          <ul className="space-y-3">
            {lowStockItems.map((item) => (
              <li key={item.id}>
                <div className="flex justify-between mb-1">
                  <span>{item.name}</span>
                  <span className="text-red-400 font-semibold">{item.stock} left</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: `${Math.min(item.stock * 10, 100)}%` }}
                  ></div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}