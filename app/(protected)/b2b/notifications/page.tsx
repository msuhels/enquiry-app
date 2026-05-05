"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft as ArrowLeftIcon, Bell as BellIcon, Loader2 } from "lucide-react";
import { useFetch } from "@/hooks/api/useFetch";
import Link from "next/link";

/**
 * Announcement interface matching the API response
 */
interface Announcement {
  id: string;
  created_at: string;
  title: string;
  content: string;
  image_url: string | null;
  created_by: string;
  is_read: boolean;
}

/**
 * NotificationItem component - displays a single announcement
 */
const NotificationItem = ({
  id,
  title,
  content,
  createdAt,
  isRead,
  onMarkRead,
}: {
  id: string;
  title: string;
  content: string;
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
      className={`px-5 py-4 border-b border-gray-200 last:border-b-0 transition 
      ${!isRead ? "bg-[#3A38861A]" : "bg-white"}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <BellIcon
            className={`w-5 h-5 flex-shrink-0 mt-1
            ${!isRead ? "text-[#3A3886]" : "text-gray-400"}`}
          />
          <div className="max-w-lg">
           <Link href={`/b2b/updates/view/${id}`} className="">
           
            <p
              className={`text-base font-semibold 
              ${!isRead ? "text-[#3A3886]" : "text-gray-600"}`}
            >
              A new update is recently announce by the admin
              
            </p>
            <p>
              {title}...
            </p>
            </Link>
          </div>
        </div>

        {!isRead ? (
          <button
            onClick={() => onMarkRead(id)}
            className="text-lg whitespace-nowrap text-white bg-[#F97316] px-2 py-1 rounded-full hover:bg-[#EA580C] transition cursor-pointer"
          >
            Mark as Read
          </button>
        ) : (
          <span className="text-lg text-gray-700 bg-gray-200 px-2 py-1 rounded-full">
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

/**
 * Main Notifications Page component
 */
export default function NotificationsPage() {
  const router = useRouter();
  const [pageLoading, setPageLoading] = useState(true);

  // Fetch announcements with user's read status from the new API
  const {
    data: notificationsData,
    isLoading,
    error,
    mutate,
  } = useFetch("/api/admin/user-notifications");

  // Extract announcements list and unread count from API response
  const announcements: Announcement[] = notificationsData?.data || [];
  const unreadCount = notificationsData?.unreadCount || 0;

  useEffect(() => {
    if (!isLoading) setPageLoading(false);
  }, [isLoading]);

  /**
   * Mark an announcement as read
   * Calls the API to insert/update the user_notification table
   */
  const markAsRead = async (id: string) => {
    const announcement = announcements.find((a) => a.id === id);
    if (!announcement) return;

    // Skip if already read
    if (announcement.is_read) return;

    // Optimistic update - immediately show as read in UI
    mutate(
      {
        data: announcements.map((a) =>
          a.id === id ? { ...a, is_read: true } : a
        ),
        unreadCount: Math.max(0, unreadCount - 1),
      },
      false
    );

    try {
      const response = await fetch(`/api/admin/user-notifications/read/${id}`, {
        method: "POST",
      });

      if (!response.ok) {
        console.error("Failed to mark as read:", await response.text());
        // Revert on error
        mutate();
        return;
      }

      // Refresh data from server
      mutate();
    } catch (error) {
      console.error("Error marking as read:", error);
      // Revert on error
      mutate();
    }
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
          {unreadCount > 0 && (
            <span className="ml-2 bg-[#F97316] text-white text-sm px-3 py-1 rounded-full">
              {unreadCount} unread
            </span>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {pageLoading || isLoading ? (
            <div className="p-6 text-center text-gray-500 text-base flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading notifications...
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-500 text-base">
              Failed to load notifications.
            </div>
          ) : announcements.length > 0 ? (
            <div>
              {announcements.map((announcement) => (
                <NotificationItem
                  key={announcement.id}
                  id={announcement.id}
                  title={announcement.title}
                  content={announcement.content}
                  createdAt={announcement.created_at}
                  isRead={announcement.is_read}
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
