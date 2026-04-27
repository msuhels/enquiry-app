import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/adapters/server";


export async function GET(request: Request) {
    const supabase = await createClient();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get total count
    const { count } = await supabase
        .from("feedbacks")
        .select("*", { count: "exact", head: true });

    const { data: feedbacks, error } = await supabase
        .from("feedbacks")
        .select("*")
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

    if (error) {
        console.error("Error fetching feedbacks:", error);
        return new NextResponse("Error fetching feedbacks", { status: 500 });
    }

    return NextResponse.json({
        success: true,
        data: feedbacks || [],
        pagination: {
            page,
            limit,
            total: count || 0,
            totalPages: Math.ceil((count || 0) / limit)
        }
    });
}
