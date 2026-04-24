import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/adapters/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const limit = Number(searchParams.get("limit")) || 10;
    const offset = Number(searchParams.get("offset")) || 0;

    const supabase = await createClient();

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    let query = supabase
        .from("escalations")
        .select(`
    *,
    user:user_id (
      full_name
    )
  `, {
    count: "exact",
  });
    // Apply search if provided
    if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data: escalations, error, count } = await query
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

    if (error) {
        console.error("Error fetching escalations:", error);
        return new NextResponse("Error fetching escalations", { status: 500 });
    }

    const totalRecords = count || 0;
    const totalPages = Math.ceil((totalRecords || 0) / limit);
    const currentPage = Math.floor(offset / limit) + 1;

    return NextResponse.json({
        success: true,
        data: escalations || [],
        pagination: {
            total: totalRecords,
            limit,
            offset,
            totalPages,
            currentPage,
            hasMore: offset + limit < (totalRecords || 0),
        },
    });
}
