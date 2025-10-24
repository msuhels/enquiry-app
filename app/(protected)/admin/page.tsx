"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
  UserPlus as UserPlusIcon,
  Bell as BellIcon,
  FileText as FileTextIcon,
} from "lucide-react";

const RecentEnquiryItem = ({ name, context, time }) => (
  <div className="flex justify-between items-start border-b border-gray-100 last:border-b-0 py-3 px-6 hover:bg-gray-50 transition">
    <div>
      <p className="text-sm font-semibold text-gray-800">{name}</p>
      <p className="text-xs text-gray-500">{context}</p>
    </div>
    <p className="text-xs text-gray-400">{time}</p>
  </div>
);

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 1250,
    totalPrograms: 34,
    openEnquiries: 82,
    resolvedEnquiries: 543,
  });

  const recentEnquiries = [
    {
      name: "John Doe",
      context: "Inquiry about MBA program",
      time: "2 hours ago",
    },
    { name: "Jane Smith", context: "Question on fees", time: "5 hours ago" },
    {
      name: "Peter Jones",
      context: "Application status check",
      time: "1 day ago",
    },
    {
      name: "Amit Kumar",
      context: "Regarding scholarship",
      time: "2 days ago",
    },
  ];

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: UsersIcon,
      bg: "from-indigo-500 to-blue-500",
      text: "text-indigo-600",
      trend: "+15% from last month",
      trendColor: "text-green-500",
    },
    {
      title: "Total Programs",
      value: stats.totalPrograms,
      icon: FileTextIcon,
      bg: "from-purple-500 to-pink-500",
      text: "text-purple-600",
      trend: "+5 new programs",
      trendColor: "text-green-500",
    },
    {
      title: "Open Enquiries",
      value: stats.openEnquiries,
      icon: ClipboardListIcon,
      bg: "from-yellow-400 to-orange-500",
      text: "text-yellow-600",
      trend: "-5% from last week",
      trendColor: "text-red-500",
    },
    {
      title: "Resolved Enquiries",
      value: stats.resolvedEnquiries,
      icon: CheckCircleIcon,
      bg: "from-green-500 to-emerald-500",
      text: "text-green-600",
      trend: "+20% this month",
      trendColor: "text-green-500",
    },
  ];

  const quickActions = [
    {
      title: "Add User",
      icon: UserPlusIcon,
      color: "from-indigo-500 to-blue-500",
      link: "/admin/users/addUser",
    },
    {
      title: "Add Program",
      icon: PlusIcon,
      color: "from-purple-500 to-pink-500",
      link: "/admin/programs/addProgram",
    },
    {
      title: "Bulk Upload",
      icon: UploadIcon,
      color: "from-orange-400 to-yellow-500",
      link: "/admin/users/bulkUpload",
    },
    {
      title: "View Enquiries",
      icon: EyeIcon,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "View Reports",
      icon: BarChartIcon,
      color: "from-sky-500 to-cyan-500",
    },
    {
      title: "System Settings",
      icon: SettingsIcon,
      color: "from-gray-500 to-gray-700",
    },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex-1 overflow-y-auto p-8">
        {/* HEADER */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">
              Welcome back, <span className="text-indigo-600">Admin!</span>
            </h1>
            <p className="mt-2 text-gray-600">
              Here’s an overview of your institution’s performance.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <BellIcon className="h-6 w-6 text-gray-500 cursor-pointer hover:text-indigo-600 transition" />
            <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
              A
            </div>
          </div>
        </header>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statCards.map((card, i) => (
            <div
              key={i}
              className={`p-5 rounded-2xl shadow-md bg-white border border-gray-100 hover:shadow-lg transition transform hover:-translate-y-1`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">{card.title}</p>
                  <p className="text-3xl font-extrabold text-gray-900 mt-1">
                    {card.value}
                  </p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${card.bg}`}>
                  <card.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className={`mt-3 text-sm font-medium ${card.trendColor}`}>
                {card.trend}
              </p>
            </div>
          ))}
        </div>

        {/* QUICK ACTIONS + ENQUIRIES */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
              {quickActions.map((action, i) => (
                <Link
                  key={i}
                  href={action.href || "#"}
                  className={`rounded-xl bg-white shadow-sm hover:shadow-lg p-6 flex flex-col items-center justify-center transition transform hover:-translate-y-1 border border-gray-100`}
                >
                  <div
                    className={`p-3 rounded-full bg-gradient-to-br ${action.color}`}
                  >
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-gray-800 text-center">
                    {action.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Enquiries */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Recent Enquiries
            </h2>
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden max-h-[85%] h-[85%]">
              {recentEnquiries.map((enquiry, i) => (
                <RecentEnquiryItem key={i} {...enquiry} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
