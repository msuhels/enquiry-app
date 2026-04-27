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

    // Get total count for this user's feedbacks
    const { count } = await supabase
        .from("feedbacks")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

    const { data: feedbacks, error } = await supabase
        .from("feedbacks")
        .select("*")
        .eq("user_id", user.id)
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

export async function POST(request: Request) {
    const supabase = await createClient();

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const body = await request.json();
        const { department, rating, remarks } = body;

        if (!department || !rating || !remarks) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        const { data, error } = await supabase
            .from("feedbacks")
            .insert([
                {
                    user_id: user.id,
                    department,
                    rating,
                    remarks,
                },
            ])
            .select();

        if (error) {
            console.error("Error creating feedback:", error);
            return NextResponse.json({ success: false, message: "Error creating feedback" }, { status: 500 });
        }

        // Get user details for notification
        const { data: userData } = await supabase
            .from("users")
            .select("first_name, full_name")
            .eq("id", user.id)
            .single();

        const userName = userData?.first_name || userData?.full_name || "User";

        // Create admin notification with correct field names
        await supabase
            .from("admin_notifications")
            .insert([
                {
                    created_by: user.id,
                    notification_type: "feedback",
                    reference_id: data[0].id,
                    title: `${userName} has sent feedback`,
                    message: `New feedback from ${userName} - ${department} department. Click here to view.`,
                    is_read: false,
                },
            ]);

        return NextResponse.json({
            success: true,
            data: data[0],
        });
    } catch (error) {
        console.error("Error processing feedback:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
