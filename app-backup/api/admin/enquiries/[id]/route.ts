import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/adapters/service-role";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createServiceRoleClient();
  const { id } = await params;

  console.log("LOGGING : API received enquiry fetch request for ID:", id);

  try {
    const { data: enquiry, error: enquiryError } = await supabase
      .from("enquiries")
      .select("*")
      .eq("id", id)
      .single();

    const academicEntries = await supabase
      .from("academic_entries")
      .select(
        "*, study_level:education_levels(id,level_name), stream:streams(id,name), course:courses(id,course_name)"
      )
      .eq("enquiry_id", id);

    if (enquiryError || !enquiry)
      throw new Error("Enquiry not found or failed to fetch");

    return NextResponse.json({ success: true, data: enquiry, academicEntries });
  } catch (error) {
    console.error("API enquiry fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
