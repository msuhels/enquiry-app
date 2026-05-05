import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/adapters/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const supabase = await createClient();

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;

    // First get the escalation
    const { data: escalation, error } = await supabase
        .from("escalations")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error("Error fetching escalation:", error);
        return new NextResponse("Escalation not found", { status: 404 });
    }

    // Get user details if user_id exists
    if (escalation?.user_id) {
        const { data: userData } = await supabase
            .from("users")
            .select("full_name")
            .eq("id", escalation.user_id)
            .single();

        if (userData) {
            escalation.user = userData;
        }
    }

    return NextResponse.json({
        success: true,
        data: escalation,
    });
}
