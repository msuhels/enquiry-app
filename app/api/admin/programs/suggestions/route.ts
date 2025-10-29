import { createServiceRoleClient } from "@/lib/supabase/adapters/service-role";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceRoleClient();

    const { searchParams } = new URL(request.url);

    const previousOrCurrentStudy = searchParams.get(
      "previous_or_current_study"
    );
    const degreeGoingFor = searchParams.get("degree_going_for");

    let query = supabase.from("programs").select("*");

    if (previousOrCurrentStudy) {
      query = query.ilike(
        "previous_or_current_study",
        `%${previousOrCurrentStudy}%`
      );
    }

    if (degreeGoingFor) {
      query = query.ilike("degree_going_for", `%${degreeGoingFor}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase fetch error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    console.error("Supabase degreeGoingFor error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
