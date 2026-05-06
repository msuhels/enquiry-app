import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/adapters/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const { id } = await params;

    // First get the feedback
    const { data: feedback, error } = await supabase
      .from("feedbacks")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching feedback:", error);

      if (error.code === "PGRST116") {
        return NextResponse.json(
          {
            success: false,
            message: "Feedback not found",
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch feedback",
          error: error.message,
        },
        { status: 500 }
      );
    }

    // Now get the user details using user_id
    const { data: userData } = await supabase
      .from("users")
      .select("full_name, email")
      .eq("id", feedback.user_id)
      .single();

    // Get the ratings for this feedback
    const { data: ratings } = await supabase
      .from("feedback_ratings")
      .select("*")
      .eq("feedback_id", id);

    // Return feedback with user details and ratings
    return NextResponse.json({
      success: true,
      data: {
        ...feedback,
        user_full_name: userData?.full_name || null,
        user_email: userData?.email || null,
        ratings: ratings || [],
      },
    });
  } catch (error) {
    console.error("Feedback GET API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
