import { createClient } from "@/lib/supabase/adapters/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
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

    const {
      title,
      message,
      notification_type,
      reference_id,
    } = await request.json();

    if (!title || !message || !notification_type || !reference_id) {
      return NextResponse.json(
        {
          success: false,
          message:
            "title, message, notification_type, and reference_id are required",
        },
        { status: 400 }
      );
    }

    if (!["feedback", "escalation"].includes(notification_type)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "notification_type must be either 'feedback' or 'escalation'",
        },
        { status: 400 }
      );
    }

    const { data: notification, error } = await supabase
      .from("admin_notifications")
      .insert({
        title,
        message,
        notification_type,
        reference_id,
        created_by: user.id,
        is_read: false,
      })
      .select()
      .single();

    if (error) {
      console.error("Notification creation error:", error);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to create notification",
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Notification created successfully",
        data: notification,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin notification API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
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

    const { data: notifications, error } = await supabase
      .from("admin_notifications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching notifications:", error);

      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch notifications",
          error: error.message,
        },
        { status: 500 }
      );
    }

    const unreadCount =
      notifications?.filter(
        (notification) => notification.is_read === false
      ).length || 0;

    return NextResponse.json({
      success: true,
      data: notifications || [],
      unreadCount,
      totalCount: notifications?.length || 0,
    });
  } catch (error) {
    console.error("Notifications GET API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}