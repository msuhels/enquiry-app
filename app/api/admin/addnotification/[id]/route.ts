import { createClient } from "@/lib/supabase/adapters/server";
import { NextResponse } from "next/server";

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    const supabase = await createClient();

    try {
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                { status: 401 }
            );
        }

        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Notification ID is required",
                },
                { status: 400 }
            );
        }

        // First get the current notification to toggle is_read
        const { data: existingNotification, error: fetchError } = await supabase
            .from("admin_notifications")
            .select("is_read")
            .eq("id", id)
            .single();

        if (fetchError || !existingNotification) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Notification not found",
                },
                { status: 404 }
            );
        }

        // Toggle is_read status
        const newStatus = !existingNotification.is_read;

        const { data: notification, error } = await supabase
            .from("admin_notifications")
            .update({ is_read: newStatus })
            .eq("id", id)
            .select()
            .single();

        if (error) {
            console.error("Error updating notification:", error);
            return NextResponse.json(
                {
                    success: false,
                    message: "Failed to update notification",
                    error: error.message,
                },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: newStatus ? "Notification marked as read" : "Notification marked as unread",
            data: notification,
        });
    } catch (error) {
        console.error("Admin notification toggle API error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Internal Server Error",
            },
            { status: 500 }
        );
    }
}
