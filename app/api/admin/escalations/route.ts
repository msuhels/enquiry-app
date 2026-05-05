import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/adapters/server";

export async function GET() {
    const supabase = await createClient();

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { data: escalations, error } = await supabase
        .from("escalations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching escalations:", error);
        return new NextResponse("Error fetching escalations", { status: 500 });
    }

    return NextResponse.json({
        success: true,
        data: escalations || [],
    });
}
