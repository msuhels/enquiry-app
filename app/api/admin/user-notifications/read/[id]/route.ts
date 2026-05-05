import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/adapters/server";
import { createServiceRoleClient } from "@/lib/supabase/adapters/service-role";

/**
 * POST: Mark an announcement as read
 * Creates or updates a record in user_notification table
 */
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Await params first (Next.js 15+ requirement)
        const { id: announcementId } = await params;

        // Get the authenticated user
        const supabase = await createClient();
        const serviceRoleSupabase = await createServiceRoleClient();

        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        if (!announcementId) {
            return NextResponse.json({ success: false, message: "Announcement ID is required" }, { status: 400 });
        }

        // Check if a record already exists
        const { data: existingRecord, error: fetchError } = await serviceRoleSupabase
            .from("user_notifications")
            .select("*")
            .eq("user_id", user.id)
            .eq("announcement_id", announcementId)
            .maybeSingle();

        if (fetchError) {
            console.error("Error checking existing notification:", fetchError);
            return NextResponse.json({ success: false, message: fetchError.message }, { status: 500 });
        }

        let result;

        if (existingRecord) {
            // Update existing record
            const { data, error } = await serviceRoleSupabase
                .from("user_notifications")
                .update({ is_read: true })
                .eq("id", existingRecord.id)
                .select()
                .single();

            if (error) {
                console.error("Error updating notification:", error);
                return NextResponse.json({ success: false, message: error.message }, { status: 500 });
            }

            result = data;
        } else {
            // Insert new record
            const { data, error } = await serviceRoleSupabase
                .from("user_notifications")
                .insert({
                    user_id: user.id,
                    announcement_id: announcementId,
                    is_read: true,
                })
                .select()
                .single();

            if (error) {
                console.error("Error inserting notification:", error);
                return NextResponse.json({ success: false, message: error.message }, { status: 500 });
            }

            result = data;
        }

        return NextResponse.json({ success: true, data: result });
    } catch (error) {
        console.error("POST user-notifications/read error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
