// layouts/dashboard/index.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const res = await fetch('/api/auth/verify-user', { credentials: 'include' });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const contentType = res.headers.get('content-type');
        console.log(res.headers)
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error("Response isn't JSON");
        }

        const data = await res.json();
        setIsAdmin(data.role === 'ADMIN');
      } catch (err) {
        console.error('Error verifying user:', err);
      }
    };

    checkUserRole();
  }, []);

  return (
    <div className="flex">
      <div className="sticky top-0 h-screen">
        <Sidebar isAdmin={isAdmin} />
      </div>
      <main className="flex-1 bg-[#161B22] p-6 text-white">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;