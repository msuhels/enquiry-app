import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/adapters/service-role";

// GET: Fetch single announcement by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("GET announcement error:", error.message);
      return NextResponse.json(
        { success: false, message: "Announcement not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("GET announcement unexpected error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServiceRoleClient();

    // 1. Delete from user_notifications (reference_id matches announcement id)
    const { error: notificationError } = await supabase
      .from("user_notifications")
      .delete()
      .eq("reference_id", id)
      .eq("notification_type", "updates");

    if (notificationError) {
      console.error("Error deleting user_notifications:", notificationError);
    }

    // 2. Delete from isread_user_notification (need to first get notification IDs)
    const { data: notifications } = await supabase
      .from("user_notifications")
      .select("id")
      .eq("reference_id", id)
      .eq("notification_type", "updates");

    if (notifications && notifications.length > 0) {
      const notificationIds = notifications.map(n => n.id);
      
      await supabase
        .from("isread_user_notification")
        .delete()
        .in("user_notification_id", notificationIds);
    }

    // 3. Delete the announcement itself
    const { error: announcementError } = await supabase
      .from("announcements")
      .delete()
      .eq("id", id);

    if (announcementError) {
      console.error("Error deleting announcement:", announcementError);
      return NextResponse.json(
        { success: false, message: announcementError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Announcement and all related notifications deleted" });
  } catch (error) {
    console.error("DELETE announcement error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}