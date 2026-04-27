import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/adapters/service-role";

export interface AnnouncementInput {
  title: string;
  content: string;
  image_url?: string | null;
  created_by: string;
}

// GET: Fetch all announcements with pagination
export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    const { searchParams } = new URL(request.url);

    // Parse pagination parameters with defaults
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    // Get total count
    const { count } = await supabase
      .from("announcements")
      .select("*", { count: "exact", head: true });

    // Fetch paginated data
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    // Handle permission or table errors gracefully
    if (error) {
      console.error("GET announcements error:", error.message, error.code);
      return NextResponse.json({ success: true, data: [], pagination: { total: 0, limit, offset } });
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      pagination: {
        total: count || 0,
        limit,
        offset,
        page,
      },
    });
  } catch (error) {
    console.error("GET announcements unexpected error:", error);
    return NextResponse.json({ success: true, data: [], pagination: { total: 0, limit: 10, offset: 0 } });
  }
}

// POST: Create new announcement
export async function POST(req: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    const body: AnnouncementInput = await req.json();

    // Basic validation
    if (!body.title || !body.content || !body.created_by) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("announcements")
      .insert({
        title: body.title,
        content: body.content,
        image_url: body.image_url ?? null,
        created_by: body.created_by,
      })
      .select()
      .single();

    if (error) {
      console.error("POST announcements error:", error.message);
      return NextResponse.json({
        success: false,
        message: error.message
      }, { status: 500 });
    }

    return NextResponse.json(
      { success: true, data },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST announcements unexpected error:", error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}