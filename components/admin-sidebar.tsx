'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboardIcon, 
  UsersIcon, 
  FileTextIcon, 
  UploadIcon, 
  SettingsIcon,
  LogOutIcon
} from 'lucide-react';

interface AdminSidebarProps {
  onLogout: () => void;
}

export default function AdminSidebar({ onLogout }: AdminSidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboardIcon,
      current: pathname === '/admin'
    },
    {
      name: 'Programs',
      href: '/admin/programs',
      icon: FileTextIcon,
      current: pathname.startsWith('/admin/programs')
    },
    {
      name: 'Add Program',
      href: '/admin/programs/new',
      icon: FileTextIcon,
      current: pathname === '/admin/programs/new'
    },
    {
      name: 'Bulk Upload',
      href: '/admin/programs/upload',
      icon: UploadIcon,
      current: pathname === '/admin/programs/upload'
    },
    {
      name: 'User Management',
      href: '/admin/users',
      icon: UsersIcon,
      current: pathname.startsWith('/admin/users')
    },
    {
      name: 'Enquiries',
      href: '/admin/enquiries',
      icon: FileTextIcon,
      current: pathname.startsWith('/admin/enquiries')
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: SettingsIcon,
      current: pathname === '/admin/settings'
    }
  ];

  return (
    <div className="flex flex-col w-64 bg-gray-900 text-white">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 px-4 bg-gray-800">
        <h1 className="text-xl font-bold">Admin Panel</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                item.current
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="px-4 py-4 border-t border-gray-700">
        <button
          onClick={onLogout}
          className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white transition-colors"
        >
          <LogOutIcon className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
}