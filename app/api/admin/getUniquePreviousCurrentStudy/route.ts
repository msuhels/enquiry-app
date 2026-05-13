import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/adapters/service-role";

export async function GET(request: NextRequest) {
    try {
        const supabase = createServiceRoleClient();
        const { searchParams } = new URL(request.url);
        const degreeGoingFor = searchParams.get("degree_going_for");

        let query = supabase
            .from("programs")
            .select("previous_or_current_study")
            .neq("previous_or_current_study", "");

        if (degreeGoingFor) {
            query = query.eq("degree_going_for", degreeGoingFor);
        }

        const { data, error } = await query;

        if (error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        const previousCurrentStudy = [
            ...new Set(
                data
                    ?.map((row) => row.previous_or_current_study?.trim())
                    .filter((v) => v && v.length > 0)
            ),
        ].sort();

        return NextResponse.json({
            success: true,
            previousCurrentStudy,
        });
    } catch (error) {
        console.error("Error fetching previous current study:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
