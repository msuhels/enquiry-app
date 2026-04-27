import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/adapters/server";

export async function POST(
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

    try {
        const { error } = await supabase
            .from("admin_notifications")
            .update({ is_read: true })
            .eq("id", id);

        if (error) {
            console.error("Error marking notification as read:", error);
            return new NextResponse("Error marking notification as read", { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error in mark read API:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
