"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ClipboardList as ClipboardListIcon,
  Eye as EyeIcon,
  Plus as PlusIcon,
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
      onClick={() => router.push(`/user/enquiries/${id}`)}
      className="px-4 py-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 cursor-pointer transition"
    >
      <p className="text-sm font-semibold text-gray-800">{name}</p>
      <p className="text-xs text-gray-500">{context}</p>
      <p className="text-xs text-gray-600 mt-1">{course || "-"}</p>
    </div>
  );
};

export default function UserDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  const { data: enquiries } = useFetch("/api/user/enquiries");

  const { data: user } = useFetch("/api/admin/users/getAuthUser");

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
      value: filterEnquiries?.length || 0,
      icon: ClipboardListIcon,
      bg: "bg-gradient-to-r from-orange-400 to-yellow-400",
      trend: `+${filterEnquiries?.length || 0} total submitted`,
    },
  ];

  const quickActions = [
    // { title: "Add Enquiry", link: "/vendor/enquiries/add", icon: PlusIcon, color: "bg-purple-100" },
    {
      title: "View Enquiries",
      link: "/b2b/enquiries",
      icon: EyeIcon,
      color: "bg-green-100",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="p-8">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-5">
          <div>
            <h1 className="text-3xl font-bold">
              Hello Mr.{" "}
              <span className="text-purple-600 font-extrabold">{userName}</span>
            </h1>
            {/* <p className="text-gray-500 text-sm mt-1">
              Here’s your enquiry overview.
            </p> */}
          </div>


          <div className="flex items-center gap-4">
            <BellIcon className="w-6 h-6 text-gray-400 cursor-pointer hover:text-purple-600 transition" />
            <div className="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-semibold">
              {userName.slice(0,1)}
            </div>
          </div>
        </div>

          <div className="mb-10 w-full flex items-center justify-center text-[#000000] font-bold">
            {/* <h2 className="text-xl">Welcome to Free Education in Italy Course Finder</h2> */}
          </div>

        {/* USER STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((card, idx) => (
            <div
              key={idx}
              className={`${card.bg} text-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-white opacity-90">{card.title}</p>
                  <p className="text-4xl text-white font-bold mt-2">
                    {card.value}
                  </p>
                </div>
                <div className="bg-white/30 p-2 rounded-lg">
                  <card.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-xs mt-3 opacity-90">{card.trend}</p>
            </div>
          ))}
        </div>

        {/* QUICK ACTIONS & RECENT ENQUIRIES */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* QUICK ACTIONS */}
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

          {/* RECENT ENQUIRIES */}
          {/* <div>
            <h2 className="text-lg font-bold mb-4">My Recent Enquiries</h2>
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden max-h-[85%] h-[85%]">
              {filterEnquiries?.length ? (
                filterEnquiries.slice(0, 3).map((enquiry: Enquiry) => (
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
                ))
              ) : (
                <div className="p-4 text-center text-gray-500 text-sm">
                  No recent enquiries found.
                </div>
              )}
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
