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
        // Fetch admin notifications from admin_notifications table
        const { data: notifications, error } = await supabase
            .from("admin_notifications")
            .select(`
                id,
                created_at,
                notification_type,
                reference_id,
                title,
                message,
                created_by,
                is_read,
                users (
                    full_name,
                    first_name
                )
            `)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching admin notifications:", error);
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
        console.error("Error in admin notifications API:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}


export async function POST(req: Request) {
    const supabase = await createClient();

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { id } = await req.json();
        // add to notification table from feedback table
        const { data: feedback, error: feedbackError } = await supabase
            .from("feedbacks")
            .select(`
                id
            `)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching admin notifications:", error);
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
        console.error("Error in admin notifications API:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}