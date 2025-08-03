// layouts/dashboard/index.tsx
import React from 'react';
import Sidebar from '@/components/Sidebar';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <Sidebar isAdmin={true} />
      <main className="flex-1 bg-[#161B22] p-6 text-white">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
