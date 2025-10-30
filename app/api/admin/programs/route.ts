import { NextRequest, NextResponse } from "next/server";
import {
  getPrograms,
  ProgramServiceResult,
} from "@/lib/supabase/program/admin-program.services";
import { Program } from "@/lib/types";
import { createServiceRoleClient } from "@/lib/supabase/adapters/service-role";
import { saveNotification } from "../notifications/route";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const filters = {
      search: searchParams.get("search") || undefined,
      university: searchParams.get("university") || undefined,
      course_name: searchParams.get("course_name") || undefined,
      limit: searchParams.get("limit")
        ? parseInt(searchParams.get("limit")!)
        : undefined,
      offset: searchParams.get("offset")
        ? parseInt(searchParams.get("offset")!)
        : undefined,
    };

    console.log(
      "LOGGING : API received programs fetch request with filters:",
      filters
    );

    const result = await getPrograms(filters);

    console.log(
      "LOGGING : Admin service result:",
      result.success ? `Found ${result.data?.length} programs` : result.error
    );

    if (!result.success) {
      console.error("LOGGING : Failed to fetch programs:", result.error);
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("API programs fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// API Route Handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("LOGGING : API received program creation request");

    const {
      university,
      previous_or_current_study,
      degree_going_for,
      course_name,
      ielts_requirement,
      special_requirements,
      remarks,
    } = body;

    const hasProgramData = [
      university,
      previous_or_current_study,
      degree_going_for,
      course_name,
      ielts_requirement,
      special_requirements,
      remarks,
    ].some(
      (value) =>
        value !== null && value !== undefined && value.toString().trim() !== ""
    );

    if (!hasProgramData) {
      return NextResponse.json(
        { error: "At least one field is required" },
        { status: 400 }
      );
    }

    const programData = {
      university,
      previous_or_current_study,
      degree_going_for,
      course_name,
      ielts_requirement,
      special_requirements,
      remarks,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Program;

    const result = await createProgram(programData);

    if (!result.success) {
      console.error("LOGGING : Failed to create program:", result.error);
      return NextResponse.json({ error: result.error }, { status: 500 });
    } else {
      if(!result.data) {
        return NextResponse.json({ error: "Program creation failed" }, { status: 500 });
      }
      const data = await saveNotification({
        program_id: result.data.id,
        title: `A New Program Has Been Created - ${result?.data.course_name}`,
        description: `A new program has been created.
        Program Details:
        - University: ${result.data.university}
        - Previous/Current Study: ${result.data.previous_or_current_study}
        - Degree Going For: ${result.data.degree_going_for}
        - Course Name: ${result.data.course_name}
        - IELTS Requirement: ${result.data.ielts_requirement}
        - Special Requirements: ${result.data.special_requirements || "None"}
        - Remarks: ${result.data.remarks || "None"}
        - Created At: ${new Date(result.data.created_at).toLocaleString()}`,
      });

      if(!data) {
        console.error("LOGGING : Failed to create notification:", result.error);
        return NextResponse.json({ error: "Notification creation failed" }, { status: 500 });
      }
    }

    console.log("LOGGING : Program created successfully via API");
    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    console.error("API program creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Service Function
async function createProgram(
  programData: Program
): Promise<ProgramServiceResult<Program>> {
  try {
    const supabase = createServiceRoleClient();

    // Helper function to split values intelligently (same as bulk upload)
    const splitValues = (value: string): string[] => {
      if (value.includes("(") || value.includes(")")) {
        return [value.trim()];
      }
      return value
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v);
    };

    // Step 1: Handle degree_going_for - create if not exists
    if (programData.degree_going_for) {
      const degrees = splitValues(programData.degree_going_for);

      for (const degree of degrees) {
        // Check if degree exists
        const { data: existingDegree } = await supabase
          .from("degree_going_for")
          .select("name")
          .ilike("name", degree)
          .maybeSingle();

        // If doesn't exist, create it
        if (!existingDegree) {
          console.log(`LOGGING : Creating new degree: ${degree}`);
          const { error: degreeError } = await supabase
            .from("degree_going_for")
            .insert([{ name: degree }]);

          if (degreeError) {
            console.error("LOGGING : Failed to create degree:", degreeError);
            return {
              success: false,
              error: `Failed to create degree: ${degreeError.message}`,
            };
          }
        }
      }
    }

    // Step 2: Handle previous_or_current_study - create if not exists
    if (programData.previous_or_current_study) {
      const studies = splitValues(programData.previous_or_current_study);

      for (const study of studies) {
        // Check if study exists
        const { data: existingStudy } = await supabase
          .from("previous_or_current_study")
          .select("name")
          .ilike("name", study)
          .maybeSingle();

        // If doesn't exist, create it
        if (!existingStudy) {
          console.log(`LOGGING : Creating new study: ${study}`);
          const { error: studyError } = await supabase
            .from("previous_or_current_study")
            .insert([{ name: study }]);

          if (studyError) {
            console.error("LOGGING : Failed to create study:", studyError);
            return {
              success: false,
              error: `Failed to create study: ${studyError.message}`,
            };
          }
        }
      }
    }

    // Step 3: Insert the program with text values (not UUIDs)
    const { data, error } = await supabase
      .from("programs")
      .insert([programData])
      .select()
      .single();

    if (error) {
      console.error("Admin program creation error:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error("Admin program creation unexpected error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     console.log("LOGGING : API received program creation request");

//     const {
//       university,
//       previous_or_current_study,
//       degree_going_for,
//       course_name,
//       ielts_requirement,
//       special_requirements,
//       remarks
//     } = body;

//     const hasProgramData = [
//       university,
//       previous_or_current_study,
//       degree_going_for,
//       course_name,
//       ielts_requirement,
//       special_requirements,
//       remarks
//     ].some(value =>
//       value !== null &&
//       value !== undefined &&
//       value.toString().trim() !== ""
//     );

//     if (!hasProgramData) {
//       return NextResponse.json(
//         { error: "At least one field is required" },
//         { status: 400 }
//       );
//     }

//     const programData = {
//       university,
//       previous_or_current_study,
//       degree_going_for,
//       course_name,
//       ielts_requirement,
//       special_requirements,
//       remarks,
//       created_at: new Date().toISOString(),
//       updated_at: new Date().toISOString(),
//     } as Program

//     const result = await createProgram(programData);

//     if (!result.success) {
//       console.error("LOGGING : Failed to create program:", result.error);
//       return NextResponse.json({ error: result.error }, { status: 500 });
//     }

//     console.log("LOGGING : Program created successfully via API");
//     return NextResponse.json({ success: true, data: result.data });
//   } catch (error) {
//     console.error("API program creation error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
