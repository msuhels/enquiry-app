import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/adapters/service-role";

export async function GET(req: NextRequest) {
  const supabase = createServiceRoleClient();

  const { data: enquiries, error } = await supabase
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching enquiries:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch enquiries" }, { status: 500 });
  }

  return NextResponse.json({ success: true, data: enquiries });
}

export async function POST(req: NextRequest) {
  const supabase = createServiceRoleClient();

  try {
    const body = await req.json();
    const {
      student_name,
      email,
      phone,
      overall_percentage,
      is_gap,
      gap_years,
      custom_fields,
      academic_entries,
    } = body;

    // 1️⃣ Insert Enquiry
    const { data: enquiry, error: enquiryError } = await supabase
      .from("enquiries")
      .insert([
        {
          student_name,
          email,
          phone,
          overall_percentage,
          is_gap,
          gap_years,
          custom_fields: custom_fields ? JSON.stringify(custom_fields) : null,
        },
      ])
      .select("id")
      .single();

    if (enquiryError) throw enquiryError;

    // 2️⃣ Insert Academic Entries
    if (academic_entries?.length) {
      const formatted = academic_entries.map((entry: any) => ({
        enquiry_id: enquiry.id,
        study_level: entry.study_level || null,
        stream: entry.discipline_area || null,
        pursue: entry.what_to_pursue || null,
        score: entry.score || null,
        completion_year: entry.study_year ? parseInt(entry.study_year) : null,
        duration_years: entry.duration ? parseInt(entry.duration) : null,
        completion_date: entry.completion_date || null,
        course: entry.study_area || null,
      }));

      const { error } = await supabase.from("academic_entries").insert(formatted);
      if (error) throw error;
    }

    return NextResponse.json({
      success: true,
      message: "Enquiry created successfully",
      data: enquiry,
    });
  } catch (error: any) {
    console.error("Error creating enquiry:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}


// export async function POST(req: NextRequest) {
//   const supabase = createServiceRoleClient();

//   try {
//     const body = await req.json();

//     const {
//       student_name,
//       email,
//       phone,
//       overall_percentage,
//       is_gap,
//       gap_years,
//       custom_fields,
//       academic_entries,
//     } = body;

//     const { data: enquiry, error: enquiryError } = await supabase
//       .from("enquiries")
//       .insert([
//         {
//           student_name,
//           email,
//           phone,
//           overall_percentage,
//           is_gap,
//           gap_years,
//           custom_fields: custom_fields ? JSON.stringify(custom_fields) : null,
//         },
//       ])
//       .select("id")
//       .single();

//     if (enquiryError) {
//       console.error("Error inserting enquiry:", enquiryError);
//       return NextResponse.json(
//         { success: false, message: "Failed to insert enquiry", error: enquiryError.message },
//         { status: 500 }
//       );
//     }

//     if (academic_entries && academic_entries.length > 0) {
//       const formattedEntries = academic_entries.map((entry: any) => ({
//         enquiry_id: enquiry.id,
//         study_level: entry.study_level || null,
//         stream: entry.discipline_area || null,
//         pursue: entry.what_to_pursue || null,
//         score: entry.score || null,
//         completion_year: entry.study_year ? parseInt(entry.study_year) : null,
//         duration_years: entry.duration ? parseInt(entry.duration) : null,
//         completion_date: entry.completion_date || null,
//         course: entry.study_area || null,
//       }));

//       const { error: academicError } = await supabase
//         .from("academic_entries")
//         .insert(formattedEntries);

//       if (academicError) {
//         console.error("Error inserting academic entries:", academicError);
//         return NextResponse.json(
//           { success: false, message: "Failed to insert academic entries", error: academicError.message },
//           { status: 500 }
//         );
//       }
//     }

//     let suggestions: any[] = [];

//     const { data: programs, error: programsError } = await supabase
//       .from("programs")
//       .select(`
//         id,
//         university,
//         programme_name,
//         study_level,
//         study_area,
//         campus,
//         duration,
//         percentage_required,
//         ielts_score,
//         gre_score,
//         gmat_score,
//         toefl_score,
//         pte_score,
//         det_score,
//         custom_programs_fields (
//           field_value,
//           comparision,
//           custom_field (
//             id,
//             field_name
//           )
//         )
//       `);

//     if (programsError) {
//       console.error("Error fetching programs:", programsError);
//       return NextResponse.json(
//         { success: false, message: "Failed to fetch programs", error: programsError.message },
//         { status: 500 }
//       );
//     }

//     if (Array.isArray(custom_fields) && programs) {
//       for (const program of programs) {
//         let match = true;

//         for (const field of custom_fields) {
//           const { field: fieldName, value } = field;
//           if (!fieldName || value === "" || value === null) continue;

//           const progField = program.custom_programs_fields?.find(
//             (f: any) => f.custom_field?.field_name?.toLowerCase() === fieldName.toLowerCase()
//           );

//           if (!progField) continue;

//           const progValue = parseFloat(progField.field_value);
//           const studentValue = parseFloat(value);
//           const comparision = progField.comparision || ">=";

//           if (!isNaN(progValue) && !isNaN(studentValue)) {
//             switch (comparision) {
//               case ">":
//                 if (!(studentValue > progValue)) match = false;
//                 break;
//               case ">=":
//                 if (!(studentValue >= progValue)) match = false;
//                 break;
//               case "<":
//                 if (!(studentValue < progValue)) match = false;
//                 break;
//               case "<=":
//                 if (!(studentValue <= progValue)) match = false;
//                 break;
//               case "=":
//                 if (studentValue !== progValue) match = false;
//                 break;
//             }
//           } else {
//             if (String(value).toLowerCase() !== String(progField.field_value).toLowerCase()) {
//               match = false;
//             }
//           }

//           if (!match) break;
//         }

//         if (match) suggestions.push(program);
//       }
//     }

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Enquiry created successfully",
//         data: enquiry,
//         suggestions,
//       },
//       { status: 201 }
//     );
//   } catch (error: any) {
//     console.error("Unexpected error:", error);
//     return NextResponse.json(
//       { success: false, message: "Internal server error", error: error.message },
//       { status: 500 }
//     );
//   }
// }

