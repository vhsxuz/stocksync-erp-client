import React from 'react';
import { LogOut, Package, Settings, Users, Warehouse, ListOrdered, Store } from 'lucide-react';
import Link from 'next/link';
import LogoIcon from '@/components/LogoIcon';
import { useRouter } from 'next/navigation';

const navItems = [
  { href: '/dashboard/home', icon: <Package size={20} />, label: 'Home' },
  { href: '/dashboard/items', icon: <Warehouse size={20} />, label: 'Items' },
  { href: '/dashboard/vendors', icon: <Store size={20} />, label: 'Vendors' },
  { href: '/dashboard/categories', icon: <ListOrdered size={20} />, label: 'Categories' },
  { href: '/dashboard/settings', icon: <Settings size={20} />, label: 'Settings' },
  { href: '/dashboard/users', icon: <Users size={20} />, label: 'Users', adminOnly: true },
];

const Sidebar = ({ isAdmin = false }: { isAdmin?: boolean }) => {

    const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (res.ok) {
        router.push('/');
      } else {
        console.error('Logout failed');
      }
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

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
        <button title="Logout" onClick={handleLogout} className="rounded-md bg-red-900 p-2 hover:bg-red-800">
          <LogOut size={20} className="text-red-400" />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;