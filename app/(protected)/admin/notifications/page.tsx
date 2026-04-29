"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft as ArrowLeftIcon, Bell as BellIcon, Loader2, MessageSquare, AlertCircle, Check, X } from "lucide-react";
import { useFetch } from "@/hooks/api/useFetch";
import Link from "next/link";
import { toast } from "sonner";

/**
 * Admin Notification interface matching the admin_notifications table
 */
interface AdminNotification {
    id: string;
    created_at: string;
    notification_type: 'feedback' | 'escalation';
    reference_id: string;
    title: string;
    message: string;
    created_by: string;
    is_read: boolean;
}

/**
 * NotificationItem component - displays a single notification
 */
const NotificationItem = ({
    id,
    notificationType,
    referenceId,
    title,
    message,
    createdAt,
    isRead,
    onToggleRead,
}: {
    id: string;
    notificationType: 'feedback' | 'escalation';
    referenceId: string;
    title: string;
    message: string;
    createdAt: string;
    isRead: boolean;
    onToggleRead: (id: string) => void;
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

    // Determine the link based on notification type
    const linkHref = notificationType === 'escalation'
        ? `/admin/escalations/view/${referenceId}`
        : `/admin/feedbacks/view/${referenceId}`;

    const Icon = notificationType === 'escalation' ? AlertCircle : MessageSquare;
    const typeLabel = notificationType === 'escalation' ? 'Escalation' : 'Feedback';

    return (
        <div
            className={`px-5 py-4 border-b border-gray-200 last:border-b-0 transition 
      ${!isRead ? "bg-[#3A38861A]" : "bg-white"}`}
        >
            <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                    <Icon
                        className={`w-5 h-5 flex-shrink-0 mt-1
            ${!isRead ? "text-[#3A3886]" : "text-gray-400"}`}
                    />
                    <div className="max-w-lg">
                        <Link href={linkHref} className="">
                            <p
                                className={`text-base font-semibold 
                ${!isRead ? "text-[#3A3886]" : "text-gray-600"}`}
                            >
                                {title}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                {message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                Type: {typeLabel}
                            </p>
                        </Link>
                    </div>
                </div>

                <button
                    onClick={() => onToggleRead(id)}
                    className={`text-lg whitespace-nowrap px-3 py-1 rounded-full transition cursor-pointer flex items-center gap-1 ${isRead
                        ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        : "bg-[#F97316] text-white hover:bg-[#EA580C]"
                        }`}
                >
                    {isRead ? (
                        <>
                            <X className="w-4 h-4" />
                            Unread
                        </>
                    ) : (
                        <>
                            <Check className="w-4 h-4" />
                            Read
                        </>
                    )}
                </button>
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

    // Fetch notifications from the admin_notifications table
    // Disable revalidateOnFocus to prevent excessive API calls
    const {
        data: notificationsData,
        isLoading,
        error,
        mutate,
    } = useFetch("/api/admin/addnotification", { revalidateOnFocus: false });

    // Extract notifications list and unread count from API response
    const allNotifications: AdminNotification[] = notificationsData?.data || [];
    const unreadCount = notificationsData?.unreadCount || 0;

    // Sort notifications: unread (is_read: false) first, then read
    const notifications = [...allNotifications].sort((a, b) => {
        if (a.is_read === b.is_read) {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        return a.is_read ? 1 : -1;
    });

    useEffect(() => {
        if (!isLoading) setPageLoading(false);
    }, [isLoading]);

    /**
     * Toggle notification read status
     */
    const toggleReadStatus = async (id: string) => {
        const notification = notifications.find((n) => n.id === id);
        if (!notification) return;

        // Optimistic update
        const originalNotifications = [...notifications];
        mutate(
            {
                ...notificationsData,
                data: notifications.map((n) =>
                    n.id === id ? { ...n, is_read: !n.is_read } : n
                ),
                unreadCount: notification.is_read ? unreadCount + 1 : unreadCount - 1,
            },
            false
        );

        try {
            const response = await fetch(`/api/admin/addnotification/${id}`, {
                method: "PUT",
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                console.error("Failed to toggle read status:", data.message);
                // Revert on error
                mutate({ ...notificationsData, data: originalNotifications });
                toast.error(data.message || "Failed to update notification");
                return;
            }

            toast.success(data.message);
            // Refresh data from server
            mutate();
        } catch (error) {
            console.error("Error toggling read status:", error);
            // Revert on error
            mutate({ ...notificationsData, data: originalNotifications });
            toast.error("Failed to update notification");
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
                                    notificationType={notification.notification_type}
                                    referenceId={notification.reference_id}
                                    title={notification.title}
                                    message={notification.message}
                                    createdAt={notification.created_at}
                                    isRead={notification.is_read}
                                    onToggleRead={toggleReadStatus}
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
