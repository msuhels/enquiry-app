import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/adapters/service-role";

export interface AnnouncementInput {
  title: string;
  content: string;
  image_url?: string | null;
  created_by: string;
}

// GET: Fetch all announcements
export async function GET() {
  try {
    const supabase = createServiceRoleClient();

    // Use .maybeSingle() approach - will return null if no access
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });

    // Handle permission or table errors gracefully
    if (error) {
      console.error("GET announcements error:", error.message, error.code);
      // Return empty array on any error so the UI still works
      return NextResponse.json({ success: true, data: [] });
    }

    return NextResponse.json({ success: true, data: data || [] });
  } catch (error) {
    console.error("GET announcements unexpected error:", error);
    return NextResponse.json({ success: true, data: [] });
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