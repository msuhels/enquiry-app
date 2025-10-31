import { createServiceRoleClient } from "@/lib/supabase/adapters/service-role";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const supabase = createServiceRoleClient();

        const { data, error } = await supabase
            .from("settings")
            .select("*")
            .single();

        if (error) throw error;

        const response = NextResponse.json({ success: true, data });
        return response;
    } catch (error) {
        console.error("API settings fetch error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const supabase = createServiceRoleClient();

        const { data, error } = await supabase
            .from("settings")
            .update(body)
            .eq("id", 'e13f953d-04a3-4ee7-b5ab-98297809cb99')
            .select("*")
            .single();

        if (error) throw error;

        const response = NextResponse.json({ success: true, data });
        return response;
    } catch (error) {
        console.error("API settings update error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}