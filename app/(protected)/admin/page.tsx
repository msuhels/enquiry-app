'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Lucide Icons for Quick Actions and Stats
import {
  Users as UsersIcon,
  BookOpen as BookOpenIcon,
  ClipboardList as ClipboardListIcon,
  CheckCircle as CheckCircleIcon,
  Plus as PlusIcon,
  Upload as UploadIcon,
  Eye as EyeIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
  UserPlus as UserPlusIcon
} from 'lucide-react';

// Icons for Sidebar (based on image)
import {
  LayoutDashboard as DashboardIcon,
  BookOpenCheck as ProgramsIcon,
  Package as BulkUploadIcon,
  Users2 as UsersSidebarIcon,
  Mail as EnquiriesIcon,
  Settings2 as SettingsSidebarIcon,
  LogOut as LogoutIcon,
  Bell as BellIcon,
  FileText as FileTextIcon // Used in Quick Actions
} from 'lucide-react';

// Assuming Program type is defined as in the original code, but not strictly needed for this file.
// import { Program } from '@/lib/types';
// import Breadcrumbs from '@/components/ui/breadCrumbs'; // Removing as it's not in the image

// --- Component to render the sidebar link ---
const SidebarLink = ({ href, icon: Icon, label, isActive = false }) => (
  <Link
    href={href}
    className={`flex items-center p-3 text-sm font-medium transition-colors ${
      isActive
        ? 'bg-indigo-600 text-white rounded-r-full'
        : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    <Icon className="h-5 w-5 mr-3" />
    {label}
  </Link>
);

// --- Component to render a Quick Action button ---
const QuickActionButton = ({ href, icon: Icon, title, description, iconColorClass = 'text-gray-500' }) => (
  <Link
    href={href}
    className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer min-h-[120px]"
  >
    <div className={`p-3 rounded-full bg-gray-100 mb-2`}>
      <Icon className={`h-6 w-6 ${iconColorClass}`} />
    </div>
    <p className="text-sm font-semibold text-gray-800 text-center">{title}</p>
    {/* Removed description for a cleaner match to the UI image's Quick Actions style */}
  </Link>
);

// --- Component to render a Recent Enquiry item ---
const RecentEnquiryItem = ({ name, context, time }) => (
  <div className="flex justify-between items-start border-b border-gray-100 last:border-b-0 py-3 px-6">
    <div>
      <p className="text-sm font-medium text-gray-800">{name}</p>
      <p className="text-xs text-gray-500">{context}</p>
    </div>
    <p className="text-xs text-gray-400">{time}</p>
  </div>
);

// --- The Main Dashboard Component ---
export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);

  // Hardcoding stats to match the image, as the original component had mock values.
  const [stats, setStats] = useState({
    totalUsers: 1250,
    totalPrograms: 34,
    openEnquiries: 82,
    resolvedEnquiries: 543
  });

  const recentEnquiries = [
    { name: 'John Doe', context: 'Inquiry about MBA program', time: '2 hours ago' },
    { name: 'Jane Smith', context: 'Question on fees', time: '5 hours ago' },
    { name: 'Peter Jones', context: 'Application status check', time: '1 day ago' },
    { name: 'Amit Kumar', context: 'Regarding scholarship', time: '2 days ago' },
  ];

  useEffect(() => {
    // Mimic the loading state for a real app, though the data is hardcoded here.
    setTimeout(() => setLoading(false), 500);
  }, []);

  // Removed the explicit loading spinner rendering block to simplify the conversion,
  // focusing purely on the UI structure and styling.

  // --- Utility Component for the Stat Card to match the image style ---
  const StatCard = ({ title, value, icon: Icon, colorClass, trend, trendColorClass }) => (
    <div className="bg-white rounded-lg shadow-md p-6 flex justify-between items-center transition-all duration-300 transform hover:scale-[1.02]">
      <div className="flex-grow">
        <div className="flex items-center mb-2">
          {/* Icon with light gray background matching the image */}
          <div className="p-2 rounded-full bg-gray-100 mr-3">
            <Icon className={`h-5 w-5 ${colorClass}`} />
          </div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
        </div>
        <div className="flex items-end">
          <p className="text-3xl font-extrabold text-gray-900">{value}</p>
          <span className={`ml-3 text-sm font-semibold ${trendColorClass}`}>
            {trend}
          </span>
        </div>
      </div>
      {/* Small icon in the top right corner matching the image */}
      <div className="p-2 ml-4 self-start">
        <Icon className={`h-6 w-6 text-gray-300`} />
      </div>
    </div>
  );
  
  // Note: The image's stat cards have a slightly complex layout. I'm using a simplified
  // layout that captures the essence and key information, but for the precise
  // small icon/detail in the top right, I'll use a placeholder/generic icon.

  // --- Actual Stat Card Component to match the Image's Cards closely ---
  const ImageStatCard = ({ title, value, icon: Icon, colorClass, trend, trendColorClass, secondaryIcon: SecondaryIcon }) => (
    <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col justify-start min-h-[120px]">
        <div className="flex justify-between items-center mb-1">
            <div className="p-2">
                <Icon className={`h-6 w-6 ${colorClass}`} />
            </div>
            {/* The small icon/symbol on the top right of the card */}
            <div className="p-2 rounded-full bg-indigo-50">
                <SecondaryIcon className={`h-6 w-6 text-indigo-500`} />
            </div>
        </div>
        <div className="mb-2">
            <p className="text-3xl font-extrabold text-gray-900">{value}</p>
        </div>
        <div className="flex justify-between items-end">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <span className={`text-xs font-medium ${trendColorClass}`}>
                {trend}
            </span>
        </div>
    </div>
  );

  // Re-implementing Stat Card structure to EXACTLY match the image:
  const FinalStatCard = ({ title, value, icon: Icon, valueColor, trend, trendIcon: TrendIcon, trendColor }) => (
    <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 flex flex-col">
      <div className="flex justify-between items-start">
        <p className="text-sm text-gray-500">{title}</p>
        <div className="p-2 rounded-lg bg-gray-100">
            <Icon className={`h-5 w-5 ${valueColor}`} />
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        <div className={`flex items-center text-xs font-semibold ${trendColor}`}>
            <TrendIcon className="h-4 w-4 mr-1" />
            {trend}
        </div>
      </div>
    </div>
  );


  // Final Stat Card Data Mapping to replicate the image's design closely
  const finalStatData = [
    { 
        title: 'Total Users', 
        value: stats.totalUsers, 
        icon: UsersIcon, 
        valueColor: 'text-blue-500', 
        trend: '+15% from last month', 
        trendIcon: PlusIcon, 
        trendColor: 'text-green-500' 
    },
    { 
        title: 'Total Programs', 
        value: stats.totalPrograms, 
        icon: FileTextIcon, 
        valueColor: 'text-indigo-500', 
        trend: '+5 new programs', 
        trendIcon: PlusIcon, 
        trendColor: 'text-green-500' 
    },
    { 
        title: 'Open Enquiries', 
        value: stats.openEnquiries, 
        icon: ClipboardListIcon, 
        valueColor: 'text-yellow-500', 
        trend: '-5% from last week', 
        trendIcon: ClipboardListIcon, // Using ClipboardListIcon for a less-than symbol effect
        trendColor: 'text-red-500' 
    },
    { 
        title: 'Resolved Enquiries', 
        value: stats.resolvedEnquiries, 
        icon: CheckCircleIcon, 
        valueColor: 'text-green-500', 
        trend: '+20% this month', 
        trendIcon: CheckCircleIcon, 
        trendColor: 'text-green-500' 
    },
  ];

  // Quick Action Data for simpler rendering
  const quickActionsData = [
    { title: 'Add User', icon: UserPlusIcon, href: '#', iconColorClass: 'text-indigo-600' },
    { title: 'Add Program', icon: PlusIcon, href: '#', iconColorClass: 'text-indigo-600' },
    { title: 'Bulk Upload', icon: UploadIcon, href: '#', iconColorClass: 'text-indigo-600' },
    { title: 'View Enquiries', icon: EyeIcon, href: '#', iconColorClass: 'text-indigo-600' },
    { title: 'View Reports', icon: BarChartIcon, href: '#', iconColorClass: 'text-indigo-600' },
    { title: 'System Settings', icon: SettingsIcon, href: '#', iconColorClass: 'text-indigo-600' },
  ];


  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-8">
        <header className="flex justify-between items-center mb-8">
            <div className="flex flex-col">
                <h1 className="text-3xl font-extrabold text-gray-900">Welcome back, Admin!</h1>
                <p className="mt-1 text-gray-600">Here's a snapshot of your institution's performance.</p>
            </div>
            <div className="flex items-center space-x-4">
                {/* Notification Icon */}
                <BellIcon className="h-6 w-6 text-gray-500 cursor-pointer hover:text-indigo-600" />
                {/* User Profile Avatar (Circle 'A') */}
                <div className="h-10 w-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    A
                </div>
            </div>
        </header>

        {/* Stats Cards - Matching the image's grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {finalStatData.map((data, index) => (
            // Custom card structure to match the image precisely
            <div key={index} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                <div className="flex justify-between items-center">
                    <div className="flex-grow">
                        <p className="text-sm text-gray-500">{data.title}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{data.value}</p>
                    </div>
                    {/* Icon container */}
                    <div className="p-2 rounded-lg bg-gray-100 flex items-center justify-center ml-4">
                        <data.icon className={`h-6 w-6 ${data.valueColor}`} />
                    </div>
                </div>
                {/* Trend line */}
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center">
                    <data.trendIcon className={`h-4 w-4 mr-1 ${data.trendColor}`} />
                    <span className={`text-sm font-medium ${data.trendColor}`}>{data.trend}</span>
                </div>
            </div>
          ))}
        </div>

        {/* --- */}
        
        {/* Quick Actions & Recent Enquiries */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Quick Actions Section */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {quickActionsData.map((action, index) => (
                // Quick Action buttons styled to match the image's small, icon-centered boxes
                <Link
                  key={index}
                  href={action.href}
                  className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center justify-center hover:shadow-md transition-shadow cursor-pointer border border-gray-100 min-h-[120px]"
                >
                  <div className={`p-3 rounded-full bg-indigo-50 mb-2`}>
                    <action.icon className={`h-6 w-6 text-indigo-600`} />
                  </div>
                  <p className="text-sm font-semibold text-gray-800 text-center">{action.title}</p>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Recent Enquiries Section */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Enquiries</h2>
            <div className="bg-white rounded-lg shadow-lg">
                <div className="divide-y divide-gray-100">
                    {recentEnquiries.map((enquiry, index) => (
                      <RecentEnquiryItem 
                        key={index}
                        name={enquiry.name}
                        context={enquiry.context}
                        time={enquiry.time}
                      />
                    ))}
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}