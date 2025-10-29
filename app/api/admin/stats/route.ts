import { createServiceRoleClient } from "@/lib/supabase/adapters/service-role";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceRoleClient();

    const users = await supabase.from("users").select("id");
    const enquiries = await supabase.from("enquiries").select("id");
    const programs = await supabase.from("programs").select("id");

    const counts = await Promise.all([users, enquiries, programs]);
    const [usersCount, enquiriesCount, programsCount] = counts.map(
      (count) => count.data?.length || 0
    );

    console.log("LOGGING : Supabase stats:", { users, enquiries, programs });

    return NextResponse.json({
      data: { users : usersCount, enquiries : enquiriesCount, programs: programsCount },
      success: true,
    });
  } catch (error) {
    console.error("Supabase stats error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
