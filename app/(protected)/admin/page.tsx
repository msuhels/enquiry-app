"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Users as UsersIcon,
  ClipboardList as ClipboardListIcon,
  FileText as FileTextIcon,
  Eye as EyeIcon,
  UserPlus as UserPlusIcon,
  Bell as BellIcon,
} from "lucide-react";
import { useFetch } from "@/hooks/api/useFetch";
import { Enquiry } from "@/lib/types";

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
      // onClick={() => router.push(`/admin/enquiries/${id}`)}
      className="px-5 py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer transition-all duration-200"
    >
      <p className="text-sm font-semibold text-[#3a3886]">{name}</p>
      <p className="text-xs text-gray-600 mt-1">{context}</p>
      <p className="text-xs text-[#F97316] mt-1 font-medium">{course || "-"}</p>
    </div>
  );
};

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [notificationCount] = useState(0);

  const { data: stat } = useFetch("/api/admin/stats");
  const { data: enquiries } = useFetch("/api/admin/enquiries");

  const stats = {
    users: stat?.data?.users || 0,
    programs: stat?.data?.programs || 0,
    enquiries: stat?.data?.enquiries || 0,
  };

  const filterEnquiries = enquiries?.data;

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: stats.users,
      icon: UsersIcon,
    },
    {
      title: "Total Programs",
      value: stats.programs,
      icon: FileTextIcon,
    },
    {
      title: "Open Enquiries",
      value: stats.enquiries,
      icon: ClipboardListIcon,
    },
  ];

  const quickActions = [
    {
      title: "Add B2B Partner",
      link: "/admin/b2b/addUser",
      icon: UserPlusIcon,
    },
    {
      title: "Add Program",
      link: "/admin/programs/add",
      icon: EyeIcon,
    },
    {
      title: "View Enquiries",
      link: "/admin/enquiries",
      icon: ClipboardListIcon,
    },
  ];

  return (
    <div className="bg-gray-50">
      <div className="max-w-full mx-auto p-6 md:p-8">
        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#3a3886]">
                Welcome back, Admin
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div
                className="relative inline-block cursor-pointer group"
                onClick={() => router.push("/admin/notifications")}
              >
                <div className="p-2.5 rounded-full bg-gray-50 group-hover:bg-[#F97316]/10 transition-all duration-200">
                  <BellIcon className="w-5 h-5 text-[#3a3886] group-hover:text-[#F97316] transition-colors" />
                </div>
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-5 h-5 bg-[#F97316] text-white text-[10px] font-semibold flex items-center justify-center rounded-full px-1.5 shadow-lg">
                    {notificationCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((card, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-br from-[#3a3886] to-[#2d2b6b] text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl">
                  <card.icon className="w-7 h-7 text-white" />
                </div>
              </div>

              <div>
                <p className="text-sm text-white/80 font-medium">
                  {card.title}
                </p>
                <p className="text-4xl font-bold mt-2">{card.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* QUICK ACTIONS + RECENT */}
        <div className=" gap-8 ">
          {/* QUICK ACTIONS */}
          <div className="lg:col-span-2 w-full ">
            <div className="flex items-center justify-between mb-6 w-[50%]">
              <h2 className="text-xl font-bold text-[#3a3886]">
                Quick Actions
              </h2>
              <div className="h-1 flex-1 ml-4 bg-gradient-to-r from-[#F97316] to-transparent rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {quickActions.map((action, idx) => (
                <div
                  key={idx}
                  onClick={() => router.push(action.link)}
                  className="group bg-white rounded-2xl p-8 shadow-sm border-2 border-gray-100 hover:border-[#F97316] transition-all duration-300 cursor-pointer hover:shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-gradient-to-br from-[#F97316] to-[#ff8c42] rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300">
                      <action.icon className="w-7 h-7 text-white" />
                    </div>

                    <div>
                      <p className="text-base font-bold text-[#3a3886] group-hover:text-[#F97316] transition-colors">
                        {action.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Click to open
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RECENT ENQUIRIES */}
        <div className="w-[50%]">
          <div className="flex items-center justify-between my-6">
            <h2 className="text-xl font-bold text-[#3a3886]">
              Recent Activity
            </h2>
            <div className="h-1 flex-1 ml-4 bg-gradient-to-r from-[#F97316] to-transparent rounded-full"></div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {filterEnquiries?.length ? (
              <div className="max-h-[250px] overflow-y-auto">
                {filterEnquiries.slice(0, 5).map((e: Enquiry) => (
                  <RecentEnquiryItem
                    key={e.id}
                    name={e.createdby.full_name}
                    context={e.created_at.slice(0, 10)}
                    course={e.degree_going_for}
                    id={e.id}
                  />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-600 text-sm">
                No recent enquiries…
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
