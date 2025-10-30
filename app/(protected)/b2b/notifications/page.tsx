"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft as ArrowLeftIcon, Bell as BellIcon } from "lucide-react";
import { useFetch } from "@/hooks/api/useFetch";

// Define the structure for a single Notification item
interface Notification {
  id: string; // Assuming an 'id' is present for keys, even if not in your table schema
  created_at: string;
  title: string;
  description: string;
}

// Helper component for a single notification item
const NotificationItem = ({
  title,
  description,
  createdAt,
}: {
  title: string;
  description: string;
  createdAt: string;
}) => {
  // Function to format the timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    // You can customize the date/time format here
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="px-5 py-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition">
      <div className="flex items-center space-x-3">
        <BellIcon className="w-5 h-5 text-purple-600 flex-shrink-0" />
        <div className="flex-grow">
          <p className="text-base font-semibold text-gray-800">{title}</p>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2 text-right">
        {formatTime(createdAt)}
      </p>
    </div>
  );
};

export default function NotificationsPage() {
  const router = useRouter();
  // State for loading, though useFetch handles it internally,
  // we can use it to show a loading state for the page content.
  const [pageLoading, setPageLoading] = useState(true);

  // Fetch notifications data
  // Assuming the API endpoint and response structure from the dashboard component:
  // const { data: notifications } = useFetch("/api/admin/notifications");
  const {
    data: notifications,
    isLoading,
    error,
  } = useFetch("/api/admin/notifications");

  const notificationList: Notification[] = notifications?.data || [];

  useEffect(() => {
    // Simulate a slight delay to ensure the fetch has started/completed
    if (!isLoading) {
      setPageLoading(false);
    }
  }, [isLoading]);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="p-8">
        {/* HEADER */}
        <div className="flex items-center space-x-4 mb-8">
          <ArrowLeftIcon
            className="w-6 h-6 text-gray-700 cursor-pointer hover:text-purple-600 transition"
            onClick={() => router.back()} // Go back to the previous page (dashboard)
          />
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        </div>

        {/* NOTIFICATIONS CONTAINER */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {pageLoading || isLoading ? (
            <div className="p-6 text-center text-gray-500 text-base">
              Loading notifications...
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-500 text-base">
              Failed to load notifications.
            </div>
          ) : notificationList.length > 0 ? (
            <div>
              {notificationList.map((notification) => (
                <NotificationItem
                  // Use a unique combination if 'id' is missing, e.g., created_at + title
                  key={notification.id}
                  title={notification.title}
                  description={notification.description}
                  createdAt={notification.created_at}
                />
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500 text-base">
              No notifications.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
