import React from 'react';
import { LogOut, Package, Settings, Users, FileText, Warehouse } from 'lucide-react';
import Link from 'next/link';
import LogoIcon from '@/components/LogoIcon';

const navItems = [
  { href: '/dashboard/home', icon: <Package size={20} />, label: 'Home' },
  { href: '/dashboard/items', icon: <Warehouse size={20} />, label: 'Items' },
  { href: '/dashboard/reports', icon: <FileText size={20} />, label: 'Reports' },
  { href: '/dashboard/settings', icon: <Settings size={20} />, label: 'Settings' },
  { href: '/dashboard/users', icon: <Users size={20} />, label: 'Users', adminOnly: true },
];

const Sidebar = ({ isAdmin = false }: { isAdmin?: boolean }) => {
  return (
    <aside className="flex h-screen w-16 flex-col items-center bg-[#0D1117] py-4 text-white">
      {/* Top: Logo */}
      <div className="mb-6">
        <LogoIcon height={24} width={24} />
      </div>

      {/* Middle: Nav vertically centered in remaining space */}
      <div className="flex flex-1 w-full items-center justify-center">
        <nav className="flex flex-col items-center gap-4">
          {navItems.map(
            ({ href, icon, label, adminOnly }) =>
              (!adminOnly || isAdmin) && (
                <Link key={href} href={href} title={label} className="rounded-md p-2 hover:bg-[#1C1F26]">
                  {icon}
                </Link>
              )
          )}
        </nav>
      </div>

      {/* Bottom: Logout */}
      <div className="mt-auto">
        <button title="Logout" className="rounded-md bg-red-900 p-2 hover:bg-red-800">
          <LogOut size={20} className="text-red-400" />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;