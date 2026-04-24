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
        const { data: announcements, error: announcementsError } = await serviceRoleSupabase
            .from("announcements")
            .select("*")
            .order("created_at", { ascending: false });

        if (announcementsError) {
            console.error("Error fetching announcements:", announcementsError);
            return NextResponse.json({ success: false, message: announcementsError.message }, { status: 500 });
        }
 
        // Fetch user's notification read status
        const { data: userNotifications, error: userNotifError } = await serviceRoleSupabase
            .from("user_notifications")
            .select("*")
            .eq("user_id", user.id);

        if (userNotifError) {
            console.error("Error fetching user notifications:", userNotifError);
            // Continue even if this fails - just assume all unread
        }

        // Create a map of announcement_id -> is_read
        const readMap = new Map<string, boolean>();
        userNotifications?.forEach((notif) => {
            readMap.set(notif.announcement_id, notif.is_read);
        });

        // Merge announcements with read status
        const announcementsWithReadStatus = announcements?.map((announcement) => ({
            ...announcement,
            is_read: readMap.get(announcement.id) || false,
        })) || [];

        // Sort: unread first, then by date
        announcementsWithReadStatus.sort((a, b) => {
            if (a.is_read !== b.is_read) {
                return a.is_read ? 1 : -1; // unread first
            }
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });

        // Count unread
        const unreadCount = announcementsWithReadStatus.filter((a) => !a.is_read).length;

        return NextResponse.json({
            success: true,
            data: announcementsWithReadStatus,
            unreadCount,
        });
    } catch (error) {
        console.error("GET user-notifications error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
