import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/adapters/service-role";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createServiceRoleClient();
  const { id } = await params;

  console.log("LOGGING : API received suggestion fetch request for ID:", id);

  try {
    const { data: enquiry, error: enquiryError } = await supabase
      .from("enquiries")
      .select("custom_fields")
      .eq("id", id)
      .single();

    if (enquiryError || !enquiry)
      throw new Error("Enquiry not found or failed to fetch");

    const custom_fields = enquiry.custom_fields
      ? JSON.parse(enquiry.custom_fields)
      : [];

    const { data: programs, error: programsError } = await supabase.from(
      "programs"
    ).select(`
        id,
        university,
        programme_name,
        study_level,
        study_area,
        campus,
        duration,
        percentage_required,
        ielts_score,
        gre_score,
        gmat_score,
        toefl_score,
        pte_score,
        det_score,
        custom_programs_fields (
          field_value,
          comparision,
          custom_field (
            id,
            field_name
          )
        )
      `);

    if (programsError) throw programsError;

    const suggestions = programs.filter((program) => {
      if (!custom_fields || custom_fields.length === 0) return true;
      
      return custom_fields.every((cf: any) => {
        const matchField = program.custom_programs_fields?.find(
          (p: any) =>
            p.custom_field?.field_name?.toLowerCase() ===
            cf.field?.toLowerCase()
        );

        if (!matchField) return false;

        const progVal = parseFloat(matchField.field_value);
        const userVal = parseFloat(cf.value);
        const cmp = matchField.comparision || ">=";

        if (!isNaN(progVal) && !isNaN(userVal)) {
          switch (cmp) {
            case ">":
              return userVal > progVal;
            case ">=":
              return userVal >= progVal;
            case "<":
              return userVal < progVal;
            case "<=":
              return userVal <= progVal;
            case "=":
              return userVal === progVal;
            default:
              return false;
          }
        }
        return (
          String(cf.value).toLowerCase() ===
          String(matchField.field_value).toLowerCase()
        );
      });
    });

    return NextResponse.json({ success: true, data: suggestions });
  } catch (error: any) {
    console.error("Error fetching suggestions:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch suggestions",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
