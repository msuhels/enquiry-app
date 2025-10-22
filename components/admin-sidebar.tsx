'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  // Icons used in the provided code
  LayoutDashboard as DashboardIcon, 
  Users2 as UsersSidebarIcon, 
  Settings2 as SettingsSidebarIcon,
  Upload as BulkUploadIcon, 
  LogOut as LogoutIcon,
  // Icons matching the image: Programs (BookOpenCheck) & Enquiries (Mail)
  BookOpenCheck as ProgramsIcon, 
  Mail as EnquiriesIcon,
  // Icon for the 'N' in the logout section
  Package as GenericBulkIcon // Using a generic icon for Bulk Upload as its icon is Package in the image context
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
      icon: DashboardIcon,
      // Check for exact match for dashboard
      current: pathname === '/admin' || pathname === '/admin/dashboard' 
    },
    {
      name: 'Programs',
      href: '/admin/programs',
      icon: ProgramsIcon, // Using ProgramsIcon for a better visual match
      current: pathname.startsWith('/admin/programs')
    },
    // {
    //   name: 'Bulk Upload',
    //   href: '/admin/programs/upload',
    //   icon: BulkUploadIcon, // Using UploadIcon
    //   current: pathname === '/admin/programs/upload'
    // },
    {
      name: 'Users',
      href: '/admin/users',
      icon: UsersSidebarIcon, // Using Users2 icon
      current: pathname.startsWith('/admin/users')
    },
    {
      name: 'Enquiries',
      href: '/admin/enquiries',
      icon: EnquiriesIcon, // Using Mail icon for Enquiries
      current: pathname.startsWith('/admin/enquiries')
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: SettingsSidebarIcon, // Using Settings2 icon
      current: pathname === '/admin/settings'
    }
  ];

  return (
    // Outer container matching the image's structure
    <div className="flex flex-col w-56 h-screen border-r border-gray-200 bg-white">
      {/* Logo/Admin Panel Title */}
      <div className="flex items-center h-16 px-4">
        <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          // Conditional styling for the active state
          const linkClass = item.current
            ? 'bg-indigo-600 text-white shadow-lg rounded-r-full' // Active: Indigo background, white text, pill shape
            : 'text-gray-600 hover:bg-gray-100 rounded-r-full'; // Inactive: Gray text, subtle hover
          
          return (
            <Link
              key={item.name}
              href={item.href}
              // The active link needs a negative margin to align with the text block edge, 
              // but for simplicity and responsiveness, we'll keep the padding consistent.
              className={`flex items-center px-4 py-3 text-sm font-medium transition-colors ${linkClass}`}
            >
              <Icon className={`mr-3 h-5 w-5 ${item.current ? 'text-white' : 'text-gray-500'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout Section - Matching the image's structure */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="flex items-center w-full text-gray-600 hover:text-indigo-600 transition-colors"
        >
          {/* 'N' Circle Avatar */}
          <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
            <span className="text-sm font-semibold text-gray-700">N</span>
          </div>
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}