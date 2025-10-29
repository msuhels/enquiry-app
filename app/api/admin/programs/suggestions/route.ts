import { createServiceRoleClient } from "@/lib/supabase/adapters/service-role";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceRoleClient();

    const { searchParams } = new URL(request.url);
    const previousOrCurrentStudy = searchParams.get("previous_or_current_study");
    const degreeGoingFor = searchParams.get("degree_going_for");
    
    const { data, error } = await supabase
      .from("programs")
      .select(
        `
    *,
    previous_or_current_study:previous_or_current_study(*),
    degree_going_for:degree_going_for(*)
  `
      )
      .eq("previous_or_current_study", previousOrCurrentStudy)
      .eq("degree_going_for", degreeGoingFor);

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
