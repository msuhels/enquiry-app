import { createServiceRoleClient } from "@/lib/supabase/adapters/service-role";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const supabase = createServiceRoleClient();

        const { data, error } = await supabase
            .from("previous_or_current_study")
            .select("*");

        if (error) {
            console.error("Supabase getPreviousOrCurrentStudy error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ data, success: true });
    } catch (error) {
        console.error("Supabase getPreviousOrCurrentStudy error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}