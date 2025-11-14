import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/adapters/service-role";

async function getProgramFilters() {
  const supabase = createServiceRoleClient();

  // Run both queries in parallel for speed
  const [uniRes, courseRes] = await Promise.all([
    supabase.from("programs").select("university").neq("university", ""),
    supabase.from("programs").select("course_name").neq("course_name", ""),
  ]);

  if (uniRes.error) {
    return { success: false, error: uniRes.error.message };
  }
  if (courseRes.error) {
    return { success: false, error: courseRes.error.message };
  }

  const universities = [
    ...new Set(
      uniRes.data
        .map((row) => row.university?.trim())
        .filter((v) => v && v.length > 0)
    ),
  ].sort();

  const courses = [
    ...new Set(
      courseRes.data
        .map((row) => row.course_name?.trim())
        .filter((v) => v && v.length > 0)
    ),
  ].sort();

  return {
    success: true,
    filters: {
      universities,
      courses,
    },
  };
}


export async function GET() {
  try {
    const result = await getProgramFilters();

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      ...result.filters,
    });
  } catch (error) {
    console.error("Error fetching filters:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
