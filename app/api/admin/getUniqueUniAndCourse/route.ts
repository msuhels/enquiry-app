import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/adapters/service-role";

export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    const { searchParams } = new URL(request.url);
    const degreeGoingFor = searchParams.get("degree_going_for");

    // Build query with optional degree_going_for filter
    let universityQuery = supabase
      .from("programs")
      .select("university")
      .neq("university", "");

    let courseQuery = supabase
      .from("programs")
      .select("course_name")
      .neq("course_name", "");

    if (degreeGoingFor) {
      universityQuery = universityQuery.eq("degree_going_for", degreeGoingFor);
      courseQuery = courseQuery.eq("degree_going_for", degreeGoingFor);
    }

    // Run both queries in parallel for speed
    const [uniRes, courseRes] = await Promise.all([universityQuery, courseQuery]);

    if (uniRes.error) {
      return NextResponse.json({ success: false, error: uniRes.error.message }, { status: 500 });
    }
    if (courseRes.error) {
      return NextResponse.json({ success: false, error: courseRes.error.message }, { status: 500 });
    }

    const universities = [
      ...new Set(
        uniRes.data
          ?.map((row) => row.university?.trim())
          .filter((v) => v && v.length > 0)
      ),
    ].sort();

    const courses = [
      ...new Set(
        courseRes.data
          ?.map((row) => row.course_name?.trim())
          .filter((v) => v && v.length > 0)
      ),
    ].sort();

    return NextResponse.json({
      success: true,
      universities,
      courses,
    });
  } catch (error) {
    console.error("Error fetching filters:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
