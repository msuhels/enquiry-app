import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/adapters/service-role"; // adjust your import
import { getAvailableCustomFields } from "@/lib/supabase/program/admin-program.services"; // your helper function

export async function GET() {
  try {
    const result = await getAvailableCustomFields();

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to fetch custom fields" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    console.error("API /custom-fields error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected error" },
      { status: 500 }
    );
  }
}