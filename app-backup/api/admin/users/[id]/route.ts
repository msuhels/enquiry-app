import { NextRequest, NextResponse } from "next/server";
import { updateUser } from "@/lib/supabase/auth-module/services/admin-user.services";
import { deleteUser } from "@/lib/supabase/auth-module/services/user.services";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    console.log("LOGGING : API received user update request:", id);

    const result = await updateUser(id, body);

    if (!result.success) {
      console.error("LOGGING : Failed to update user:", result.error);
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    console.log("LOGGING : User updated successfully via API");
    return NextResponse.json({
      success: true,
      data: result.data,
    });

  } catch (error) {
    console.error("API user update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    console.log("LOGGING : API received user delete request:", id);

    const result = await deleteUser(id);

    if (!result.success) {
      console.error("LOGGING : Failed to delete user:", result.error);
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    console.log("LOGGING : User deleted successfully via API");
    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });

  } catch (error) {
    console.error("API user delete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}