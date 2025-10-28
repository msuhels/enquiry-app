import { NextRequest, NextResponse } from "next/server";
import { toggleUserStatus } from "@/lib/supabase/auth-module/services/admin-user.services";

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, status } = body;
    console.log("LOGGING : API received toggle request:", { userId, status });
    if (!userId || status === undefined) {
      return NextResponse.json(
        { error: "Missing userId or status" },
        { status: 400 }
      );
    }

    console.log("LOGGING : API received toggle request:", { userId, status });

    const result = await toggleUserStatus(userId, status);

    if (!result.success) {
      console.error("LOGGING : Failed to toggle user status:", result.error);
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    console.log("LOGGING : User status updated successfully via API");
    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    console.error("API toggle user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
