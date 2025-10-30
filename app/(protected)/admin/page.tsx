"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users as UsersIcon,
  ClipboardList as ClipboardListIcon,
  CheckCircle as CheckCircleIcon,
  FileText as FileTextIcon,
  Plus as PlusIcon,
  Upload as UploadIcon,
  Eye as EyeIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
  UserPlus as UserPlusIcon,
  Bell as BellIcon,
} from "lucide-react";
import { useFetch } from "@/hooks/api/useFetch";
import { Enquiry } from "@/lib/types";
import { useRouter } from "next/navigation";

const RecentEnquiryItem = ({
  name,
  context,
  course,
  id,
}: {
  name: string;
  context: string;
  course: string;
  id: string;
}) => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/admin/enquiries/${id}/suggestions`)}
      className="px-4 py-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 cursor-pointer transition"
    >
      <p className="text-sm font-semibold text-gray-800">{name}</p>
      <p className="text-xs text-gray-500">{context}</p>
      <p className="text-xs text-gray-600 mt-1">{course || "-"}</p>
    </div>
  );
};

export default function AdminDashboard() {
  const  router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 1250,
    totalPrograms: 34,
    openEnquiries: 82,
    resolvedEnquiries: 543,
  });

  const {data} = useFetch("/api/admin/stats");

  useEffect(() => {
    setStats({
      totalUsers: data?.data?.users || 0,
      totalPrograms: data?.data?.programs || 0,
      openEnquiries: data?.data?.enquiries || 0,
      resolvedEnquiries: 543,
    });
  }, [data]);

  const { data: enquiries } = useFetch("/api/admin/enquiries");

  const filterEnquiries = enquiries?.data

  console.log("filterEnquiries", filterEnquiries);
  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: UsersIcon,
      bg: "bg-gradient-to-r from-blue-400 to-indigo-400",
      trend: "+15% from last month",
      // textClr : "text-blue-600"
    },
    {
      title: "Total Programs",
      value: stats.totalPrograms,
      icon: FileTextIcon,
      bg: "bg-gradient-to-r from-purple-400 to-pink-400",
      trend: "+5 new programs",
    },
    {
      title: "Open Enquiries",
      value: stats.openEnquiries,
      icon: ClipboardListIcon,
      bg: "bg-gradient-to-r from-orange-400 to-yellow-400",
      trend: "-5% from last week",
    },
    // {
    //   title: "Resolved Enquiries",
    //   value: stats.resolvedEnquiries,
    //   icon: CheckCircleIcon,
    //   bg: "bg-gradient-to-r from-green-400 to-emerald-400",
    //   trend: "+20% this month",
    // },
  ];

  const quickActions = [
    { title: "Add Vendor", link: "/admin/users/addUser", icon: UserPlusIcon, color: "bg-indigo-100" },
    { title: "Add Program",link: "/admin/programs/add", icon: PlusIcon, color: "bg-purple-100" },
    // { title: "Bulk Upload", link: "/admin/users/bulk-upload", icon: UploadIcon, color: "bg-orange-100" },
    { title: "View Enquiries", link: "/admin/enquiries", icon: EyeIcon, color: "bg-green-100" },
    { title: "View Reports",  icon: BarChartIcon, color: "bg-cyan-100" },
    { title: "System Settings", icon: SettingsIcon, color: "bg-gray-100" },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="p-8">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back,{" "}
              <span className="text-purple-600 font-extrabold">Admin!</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Here's an overview of your institution’s performance.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <BellIcon className="w-6 h-6 text-gray-400 cursor-pointer hover:text-purple-600 transition" />
            <div className="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-semibold">
              A
            </div>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((card, idx) => (
            <div
              key={idx}
              className={`${card.bg} text-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className={`text-sm ${card.textClr || "text-white"} opacity-90`}>{card.title}</p>
                  <p className={`text-4xl ${card.textClr || "text-white"} font-bold mt-2`}>{card.value}</p>
                </div>
                <div className="bg-white/30 p-2 rounded-lg">
                  <card.icon className={`w-6 h-6 ${card.textClr || "text-white"}`} />
                </div>
              </div>
              <p className="text-xs mt-3 opacity-90">{card.trend}</p>
            </div>
          ))}
        </div>

        {/* QUICK ACTIONS + RECENT ENQUIRIES */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {quickActions.map((action, idx) => (
                <div
                  key={idx}
                  onClick={() => router.push(action.link)}
                  className={`${action.color} rounded-xl flex flex-col items-center justify-center p-6 shadow hover:shadow-md transition cursor-pointer`}
                >
                  <div className="p-3 bg-white rounded-full shadow-sm">
                    <action.icon className="w-6 h-6 text-gray-700" />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-gray-800">
                    {action.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold mb-4">Recent Enquiries</h2>
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden max-h-[85%] h-[85%]">
              {filterEnquiries?.length ? (
                filterEnquiries
                  .slice(0, 3)
                  .map((enquiry: Enquiry, i: number) => (
                    <RecentEnquiryItem
                      key={enquiry.id}
                      name={enquiry.createdby.full_name}
                      context={(enquiry.created_at).slice(0, 10)}
                      course={
                        enquiry.degree_going_for
                      }
                      id={enquiry.id}
                    />
                  ))
              ) : (
                <div className="p-4 text-center text-gray-500 text-sm">
                  No recent enquiries found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
