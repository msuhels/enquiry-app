"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft as ArrowLeftIcon, Bell as BellIcon } from "lucide-react";
import { useFetch } from "@/hooks/api/useFetch";

// Define the structure for a single Notification item
interface Notification {
  id: string;
  created_at: string;
  title: string;
  description: string;
  is_readed: boolean;
}

// Helper component for a single notification item
const NotificationItem = ({
  id,
  title,
  description,
  createdAt,
  isRead,
  onMarkRead,
}: {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  isRead: boolean;
  onMarkRead: (id: string) => void;
}) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      onClick={() => onMarkRead(id)}
      className={`px-5 py-4 border-b border-gray-200 last:border-b-0 transition cursor-pointer 
      ${
        !isRead
          ? "bg-[#3A38861A] hover:bg-[#3A388630]"
          : "bg-white hover:bg-gray-100"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <BellIcon
            className={`w-5 h-5 flex-shrink-0 
            ${!isRead ? "text-[#3A3886]" : "text-gray-400"}`}
          />
          <div>
            <p
              className={`text-base font-semibold 
              ${!isRead ? "text-[#3A3886]" : "text-gray-600"}`}
            >
              {title}
            </p>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
        </div>

        {/* ✅ Read/Unread label */}
        {!isRead ? (
          <span className="text-xs text-white bg-[#F97316] px-2 py-1 rounded-full">
            Unread
          </span>
        ) : (
          <span className="text-xs text-gray-700 bg-gray-200 px-2 py-1 rounded-full">
            Read
          </span>
        )}
      </div>

      <p className="text-xs text-gray-500 mt-2 text-right">
        {formatTime(createdAt)}
      </p>
    </div>
  );
};

export default function NotificationsPage() {
  const router = useRouter();
  const [pageLoading, setPageLoading] = useState(true);

  const {
    data: notifications,
    isLoading,
    error,
    mutate,
  } = useFetch("/api/admin/notifications");

  const notificationList: Notification[] = notifications?.data || [];

  useEffect(() => {
    if (!isLoading) setPageLoading(false);
  }, [isLoading]);

  // Mark notification as read
  const markAsRead = async (id: string) => {
    const notif = notificationList.find((n) => n.id === id);
    if (!notif) return;

    // ✅ Skip if already read
    if (notif.is_readed) return;

    // ✅ Optimistic UI update
    mutate(
      {
        data: notificationList.map((n) =>
          n.id === id ? { ...n, is_readed: true } : n
        ),
      },
      false
    );

    await fetch(`/api/admin/notifications/read/${id}`, { method: "POST" });

    mutate();
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="p-8">
        <div className="flex items-center space-x-4 mb-8">
          <ArrowLeftIcon
            className="w-6 h-6 text-gray-700 cursor-pointer hover:text-purple-600 transition"
            onClick={() => router.back()}
          />
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        </div>

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
                  key={notification.id}
                  id={notification.id}
                  title={notification.title}
                  description={notification.description}
                  createdAt={notification.created_at}
                  isRead={notification.is_readed}
                  onMarkRead={markAsRead}
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
