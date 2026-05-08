import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/adapters/server";
import { createServiceRoleClient } from "@/lib/supabase/adapters/service-role";

/**
 * GET: Fetch announcements with user's read status
 * Returns all announcements with is_read flag based on user_notification table
 */
export async function GET(req: NextRequest) {
    try {
        // Get the authenticated user
        const supabase = await createClient();
        const serviceRoleSupabase = await createServiceRoleClient();

        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        // Fetch all announcements
        const { data: notifications, error: notificationError } = await serviceRoleSupabase
            .from("user_notifications")
            .select("*")
            .order("created_at", { ascending: false });

        if (notificationError) {
            console.error("Error fetching notifications:", notificationError);
            return NextResponse.json({ success: false, message: notificationError.message }, { status: 500 });
        }

        // Fetch user's notification read status
        const { data: readNotifications, error: readError } = await serviceRoleSupabase
            .from("isread_user_notification")
            .select("*")
            .eq("user_id", user.id);

        if (readError) {
            console.error("Error fetching user notifications:", readError);
            // Continue even if this fails - just assume all unread
        }

        // Create a map of user_notification_id -> is_read (matching the schema)
        const readMap = new Map<string, boolean>();
        readNotifications?.forEach((notif) => {
            readMap.set(notif.user_notification_id.toString(), notif.is_read);
        });

        // Merge notifications with read status
        const notificationsWithReadStatus = notifications?.map((notification) => ({
            ...notification,
            is_read: readMap.get(notification.id.toString()) || false,
        })) || [];

        // Sort: unread first, then by date
        notificationsWithReadStatus.sort((a, b) => {
            if (a.is_read !== b.is_read) {
                return a.is_read ? 1 : -1; // unread first
            }
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });

        // Count unread
        const unreadCount = notificationsWithReadStatus.filter((a) => !a.is_read).length;

        return NextResponse.json({
            success: true,
            data: notificationsWithReadStatus,
            unreadCount,
        });
    } catch (error) {
        console.error("GET user-notifications error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
