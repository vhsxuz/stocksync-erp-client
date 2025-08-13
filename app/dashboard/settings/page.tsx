// app/dashboard/home/page.tsx
'use client';

import React, { useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const Settings = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/verify-user', { credentials: 'include' });
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error('Error fetching user info:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div className="text-gray-400 p-6">Loading settings...</div>;
  }

  if (!user) {
    return <div className="text-red-400 p-6">Failed to load user data.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto bg-[#1B232A] p-6 rounded-2xl shadow-lg text-white">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <p className="text-sm text-gray-400 mt-1">Customize your preferences</p>

      <div className="mt-6 space-y-6">
        {/* Profile Section */}
        <section>
          <h2 className="text-lg font-medium border-b border-gray-700 pb-2 mb-4">
            Profile
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Name</label>
              <input
                type="text"
                defaultValue={user.name}
                className="w-full p-2 rounded bg-[#161B22] border border-gray-600 focus:border-[#5ED5A8] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                defaultValue={user.email}
                className="w-full p-2 rounded bg-[#161B22] border border-gray-600 focus:border-[#5ED5A8] outline-none"
              />
            </div>
          </div>
        </section>

        {/* Preferences */}
        <section>
          <h2 className="text-lg font-medium border-b border-gray-700 pb-2 mb-4">
            Preferences
          </h2>
          <div className="flex items-center justify-between">
            <span>Email Notifications</span>
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
              className="w-5 h-5 accent-[#5ED5A8]"
            />
          </div>
          <div className="flex items-center justify-between mt-4">
            <span>Dark Mode</span>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
              className="w-5 h-5 accent-[#5ED5A8]"
            />
          </div>
        </section>

        {/* Security */}
        <section>
          <h2 className="text-lg font-medium border-b border-gray-700 pb-2 mb-4">
            Security
          </h2>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">
            Change Password 
          </button>
        </section>
      </div>
    </div>
  );
};

export default Settings;