import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/adapters/server";


export async function GET(request: Request) {
    const supabase = await createClient();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    // Filter parameters
    const department = searchParams.get("department") || "";
    const fromDate = searchParams.get("from_date") || "";
    const toDate = searchParams.get("to_date") || "";

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    // Build base query for count
    let countQuery = supabase
        .from("feedbacks")
        .select("*", { count: "exact", head: true });

    // Build base query for data with user join
    let dataQuery = supabase
        .from("feedbacks")
        .select(`
            *,
            user:users!feedbacks_user_id_fkey (full_name, email)
        `);

    // Apply department filter
    if (department) {
        countQuery = countQuery.eq("department", department);
        dataQuery = dataQuery.eq("department", department);
    }

    // Apply date filters
    if (fromDate) {
        const fromDateTime = new Date(fromDate).toISOString();
        countQuery = countQuery.gte("created_at", fromDateTime);
        dataQuery = dataQuery.gte("created_at", fromDateTime);
    }

    if (toDate) {
        const toDateTime = new Date(toDate + "T23:59:59").toISOString();
        countQuery = countQuery.lte("created_at", toDateTime);
        dataQuery = dataQuery.lte("created_at", toDateTime);
    }

    // Get total count
    const { count, error: countError } = await countQuery;

    if (countError) {
        console.error("Error counting feedbacks:", countError);
        return new NextResponse("Error counting feedbacks", { status: 500 });
    }

    // Get paginated data
    const { data: feedbacks, error } = await dataQuery
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

    if (error) {
        console.error("Error fetching feedbacks:", error);
        return new NextResponse("Error fetching feedbacks", { status: 500 });
    }

    // Transform the data to flatten user info
    const transformedFeedbacks = (feedbacks || []).map((feedback: any) => ({
        ...feedback,
        createdby: feedback.user ? {
            full_name: feedback.user.full_name || "Unknown"
        } : { full_name: "Unknown" }
    }));

    return NextResponse.json({
        success: true,
        data: transformedFeedbacks || [],
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
        const { department, improvement_area, open_feedback, ratings } = body;

        if (!department || !ratings || !Array.isArray(ratings) || ratings.length === 0) {
            return NextResponse.json(
                { success: false, message: "Invalid input data" },
                { status: 400 }
            );
        }

        const feedbackId = crypto.randomUUID();

        const { error: feedbackError } = await supabase
            .from("feedbacks")
            .insert({
                id: feedbackId,
                user_id: user.id,
                improvement_area,
                department,
                open_feedback,
            });


        if (feedbackError) {
            console.error("Error creating feedback:", feedbackError);
            return NextResponse.json(
                { success: false, message: "Error creating feedback" },
                { status: 500 }
            );
        }

        const ratingsPayload = ratings.map((item: any) => ({
            feedback_id: feedbackId,
            department: item.department,
            parameter: item.parameter,
            rating: item.rating,
            remark: item.remark || "",
        }));


        const { error: ratingError } = await supabase
            .from("feedback_ratings")
            .insert(ratingsPayload);

        if (ratingError) {
            console.error("Error inserting ratings:", ratingError);

            // ❗ Rollback parent insert
            await supabase.from("feedbacks").delete().eq("id", feedbackId);

            return NextResponse.json(
                { success: false, message: "Error saving ratings" },
                { status: 500 }
            );
        }


        // Get user details for notification
        // const { data: userData } = await supabase
        //     .from("users")
        //     .select("first_name, full_name")
        //     .eq("id", user.id)
        //     .single();

        // const userName = userData?.first_name || userData?.full_name || "User";

        // Create admin notification with correct field names
        // await supabase
        //     .from("admin_notifications")
        //     .insert([
        //         {
        //             created_by: user.id,
        //             notification_type: "feedback",
        //             reference_id: data[0].id,
        //             title: `${userName} has sent feedback`,
        //             message: `New feedback from ${userName} - ${department} department. Click here to view.`,
        //             is_read: false,
        //         },
        //     ]);

        return NextResponse.json({
            success: true,
            message: "Feedback submitted successfully",
            feedback_id: feedbackId,
        });
    } catch (error) {
        console.error("Error processing feedback:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
