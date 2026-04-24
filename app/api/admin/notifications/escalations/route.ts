import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/adapters/server";

export async function GET() {
    const supabase = await createClient();

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        // Fetch admin notifications with escalation and user details
        const { data: notifications, error } = await supabase
            .from("admin_notification")
            .select(`
                id,
                created_at,
                escalation_id,
                is_read,
                user_id,
                escalations (
                    zone,
                    user_message,
                    level,
                    created_at
                ),
                users (
                    full_name
                )
            `)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching notifications:", error);
            return new NextResponse("Error fetching notifications", { status: 500 });
        }

        // Calculate unread count
        const unreadCount = notifications?.filter(n => !n.is_read).length || 0;

        return NextResponse.json({
            success: true,
            data: notifications || [],
            unreadCount,
        });
    } catch (error) {
        console.error("Error in notifications API:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
