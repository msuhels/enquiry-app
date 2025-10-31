"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ClipboardList,
  Eye,
  Plus,
  Bell,
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
      onClick={() => router.push(`/user/enquiries/${id}`)}
      className="px-5 py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer transition-all duration-200"
    >
      <p className="text-sm font-semibold text-[#3a3886]">{name}</p>
      <p className="text-xs text-gray-600 mt-1">{context}</p>
      <p className="text-xs text-[#F97316] mt-1 font-medium">{course || "-"}</p>
    </div>
  );
};

export default function UserDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [enquiriesCount, setEnquiriesCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);

  const { data: user } = useFetch("/api/admin/users/getAuthUser");
  const userId = user?.userDetails?.id;
  const { data: enquiries } = useFetch(`/api/admin/myenquiries/${userId}`);
  const { data: notifications } = useFetch("/api/admin/notifications");

  useEffect(() => {
    if (notifications) {
      setNotificationCount(notifications?.data?.length || 0);
    }
  }, [notifications]);

  useEffect(() => {
    if (enquiries) {
      setEnquiriesCount(enquiries?.data?.length || 0);
    }
  }, [enquiries]);
  
  const filterEnquiries = enquiries?.data?.filter(
    (enquiry: Enquiry) =>
      enquiry?.academic_entries?.data?.length > 0 &&
      enquiry?.academic_entries?.data[0]?.course !== null
  );

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  useEffect(() => {
    if (user) {
      setUserName(user.userDetails.full_name);
    }
  }, [user]);

  const statCards = [
    {
      title: "My Enquiries",
      value: enquiriesCount || 0,
      icon: ClipboardList,
      // trend: `${filterEnquiries?.length || 0} Total Submitted`,
    },
  ];

  const quickActions = [
    {
      title: "View Enquiries",
      link: "/b2b/enquiries",
      icon: Eye,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto p-6 md:p-8">
        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#3a3886]">
                Welcome back, {userName}
              </h1>
              {/* <p className="text-gray-600 text-sm mt-2">
                Manage your enquiries and track your applications
              </p> */}
            </div>

            <div className="flex items-center gap-4">
              <div 
                className="relative inline-block cursor-pointer group"
                onClick={() => router.push("/b2b/notifications")}
              >
                <div className="p-2.5 rounded-full bg-gray-50 group-hover:bg-[#F97316]/10 transition-all duration-200">
                  <Bell className="w-5 h-5 text-[#3a3886] group-hover:text-[#F97316] transition-colors" />
                </div>
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-5 h-5 bg-[#F97316] text-white text-[10px] font-semibold flex items-center justify-center rounded-full px-1.5 shadow-lg">
                    {notificationCount}
                  </span>
                )}
              </div>

              {/* <div className="h-11 w-11 rounded-full bg-gradient-to-br from-[#F97316] to-[#3a3886] flex items-center justify-center text-white font-bold text-lg shadow-md">
                {userName.slice(0, 1).toUpperCase()}
              </div> */}
            </div>
          </div>
        </div>

        {/* STATS CARD */}
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
                <p className="text-sm text-white/80 font-medium">{card.title}</p>
                <p className="text-4xl font-bold mt-2">{card.value}</p>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-xs text-white/70">{card.trend}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* QUICK ACTIONS & RECENT ENQUIRIES */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* QUICK ACTIONS */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#3a3886]">Quick Actions</h2>
              <div className="h-1 flex-1 ml-4 bg-gradient-to-r from-[#F97316] to-transparent rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                      <p className="text-xs text-gray-500 mt-1">Access your enquiries</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RECENT ENQUIRIES */}
          {/* <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#3a3886]">Recent Activity</h2>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {filterEnquiries?.length ? (
                <div className="max-h-[400px] overflow-y-auto">
                  {filterEnquiries.slice(0, 5).map((enquiry: Enquiry) => (
                    <RecentEnquiryItem
                      key={enquiry.id}
                      name={enquiry.student_name}
                      context={enquiry.email}
                      course={
                        enquiry.academic_entries?.data?.[0]?.course?.course_name ||
                        "-"
                      }
                      id={enquiry.id}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ClipboardList className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 text-sm font-medium">No enquiries yet</p>
                  <p className="text-gray-400 text-xs mt-1">Your recent enquiries will appear here</p>
                </div>
              )}
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}