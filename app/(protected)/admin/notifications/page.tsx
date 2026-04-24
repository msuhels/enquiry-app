"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft as ArrowLeftIcon, Bell as BellIcon, Loader2 } from "lucide-react";
import { useFetch } from "@/hooks/api/useFetch";
import Link from "next/link";

/**
 * Admin Notification interface matching the API response
 */
interface AdminNotification {
    id: string;
    created_at: string;
    escalation_id: string;
    is_read: boolean;
    user_id: string;
    escalations: {
        zone: string;
        user_message: string;
        level: string;
        created_at: string;
    } | null;
    users: {
        full_name: string;
    } | null;
}

/**
 * NotificationItem component - displays a single escalation notification
 */
const NotificationItem = ({
    id,
    escalationId,
    userName,
    userId,
    message,
    level,
    zone,
    createdAt,
    isRead,
    onMarkRead,
}: {
    id: string;
    escalationId: string;
    userName: string | null;
    userId: string;
    message: string;
    level: string;
    zone: string;
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
                        <Link href={`/admin/escalations/view/${escalationId}`} className="">
                            <p
                                className={`text-base font-semibold 
                ${!isRead ? "text-[#3A3886]" : "text-gray-600"}`}
                            >
                                New Escalation Request
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                                <span className="font-medium">{userName || "Unknown User"}</span> from {zone} zone
                            </p>
                            <p className="text-sm text-gray-500 mt-1 truncate">
                                {message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                Level: {level}
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
 * Main Admin Notifications Page component
 */
export default function AdminNotificationsPage() {
    const router = useRouter();
    const [pageLoading, setPageLoading] = useState(true);

    // Fetch escalation notifications from the new API
    const {
        data: notificationsData,
        isLoading,
        error,
        mutate,
    } = useFetch("/api/admin/notifications/escalations");

    // Extract notifications list and unread count from API response
    const notifications: AdminNotification[] = notificationsData?.data || [];
    const unreadCount = notificationsData?.unreadCount || 0;

    useEffect(() => {
        if (!isLoading) setPageLoading(false);
    }, [isLoading]);

    /**
     * Mark a notification as read
     * Calls the API to update the admin_notification table
     */
    const markAsRead = async (id: string) => {
        const notification = notifications.find((n) => n.id === id);
        if (!notification) return;

        // Skip if already read
        if (notification.is_read) return;

        // Optimistic update - immediately show as read in UI
        mutate(
            {
                data: notifications.map((n) =>
                    n.id === id ? { ...n, is_read: true } : n
                ),
                unreadCount: Math.max(0, unreadCount - 1),
            },
            false
        );

        try {
            const response = await fetch(`/api/admin/notifications/escalations/read/${id}`, {
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
                    ) : notifications.length > 0 ? (
                        <div>
                            {notifications.map((notification) => (
                                <NotificationItem
                                    key={notification.id}
                                    id={notification.id}
                                    escalationId={notification.escalation_id}
                                    userName={notification.users?.full_name || null}
                                    userId={notification.user_id}
                                    message={notification.escalations?.user_message || ""}
                                    level={notification.escalations?.level || ""}
                                    zone={notification.escalations?.zone || ""}
                                    createdAt={notification.created_at}
                                    isRead={notification.is_read}
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
