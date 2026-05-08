import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/adapters/server";

export async function PUT(request: Request) {
    const supabase = await createClient();

    const { 
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id , status } = await request.json();
    const { error } = await supabase.from("escalations").update({ status }).eq("id", id);

    if (error) {
        console.error("Error updating escalation:", error);
        return new NextResponse("Error updating escalation", { status: 500 });
    }

    return NextResponse.json({ success: true });
}