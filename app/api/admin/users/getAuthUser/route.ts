import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/adapters/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized", userDetails: null },
        { status: 401 }
      );
    }

    const { data: userDetails, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error fetching user details:", error);
      return NextResponse.json(
        { error: "Error fetching user details", userDetails: null },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { userDetails },
      {
        headers: {
          "Cache-Control": "private, max-age=60",
        },
      }
    );
  } catch (error) {
    console.error("Unexpected error in getAuthUser:", error);
    return NextResponse.json(
      { error: "Internal server error", userDetails: null },
      { status: 500 }
    );
  }
}
