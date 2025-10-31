import { NextRequest, NextResponse } from "next/server";
import {
  getProgramById,
  deleteProgram,
  ProgramServiceResult,
} from "@/lib/supabase/program/admin-program.services";
import { Program } from "@/lib/types";
import { createServiceRoleClient } from "@/lib/supabase/adapters/service-role";
import { saveNotification } from "../../notifications/route";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    console.log("LOGGING : API received program fetch request for ID:", id);

    const result = await getProgramById(id);

    if (!result.success) {
      console.error("LOGGING : Failed to fetch program:", result.error);
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error("API program fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// API Route Handler
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    console.log("LOGGING : API received program update request for ID:", id);

    const {
      university,
      previous_or_current_study,
      degree_going_for,
      course_name,
      ielts_requirement,
      special_requirements,
      remarks,
    } = body;

    // Validate that at least one field is being updated
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
        { error: "At least one field is required to update" },
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
    } as Partial<Program>;

    const result = await updateProgram(id, programData);

    if (!result.success) {
      console.error("LOGGING : Failed to update program:", result.error);
      return NextResponse.json({ error: result.error }, { status: 500 });
    } else {
      if (!result.data) {
        return NextResponse.json(
          { error: "Program update failed" },
          { status: 500 }
        );
      }
      const data = await saveNotification({
        program_id: result.data.id,
        title: `A Program Has Been Updated - ${result?.data.course_name}`,
        description: `A program has been updated.

        Program Details:
        - University: ${result.data.university}
        - Previous/Current Study: ${result.data.previous_or_current_study}
        - Degree Going For: ${result.data.degree_going_for}
        - Course Name: ${result.data.course_name}
        - IELTS Requirement: ${result.data.ielts_requirement}
        - Special Requirements: ${result.data.special_requirements || "None"}
        - Remarks: ${result.data.remarks || "None"}
        - Updated At: ${new Date().toLocaleString()}`,
      });
    }

    console.log("LOGGING : Program updated successfully via API");
    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error("API program update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Service Function
async function updateProgram(
  programId: string,
  programData: Partial<Program>
): Promise<ProgramServiceResult<Program>> {
  try {
    const supabase = createServiceRoleClient();

    // Helper function to split values intelligently (same as create)
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
          console.log(`LOGGING : Creating new degree during update: ${degree}`);
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
          console.log(`LOGGING : Creating new study during update: ${study}`);
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

    // Step 3: Update the program with text values (not UUIDs)
    const { data, error } = await supabase
      .from("programs")
      .update({
        ...programData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", programId)
      .select()
      .single();

    if (error) {
      console.error("Admin program update error:", error);
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
    console.error("Admin program update unexpected error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

// export async function PATCH(
//   request: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id } = await params;
//     const body = await request.json();

//     console.log("LOGGING : API received program update request for ID:", id);

//     const {
//       university,
//       previous_or_current_study,
//       degree_going_for,
//       course_name,
//       ielts_requirement,
//       special_requirements,
//       remarks
//     } = body;

//     // Validate that at least one field is being updated
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
//         { error: "At least one field is required to update" },
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
//     } as Partial<Program>;

//     const result = await updateProgram(id, programData);

//     if (!result.success) {
//       console.error("LOGGING : Failed to update program:", result.error);
//       return NextResponse.json(
//         { error: result.error },
//         { status: 500 }
//       );
//     }

//     console.log("LOGGING : Program updated successfully via API");
//     return NextResponse.json({
//       success: true,
//       data: result.data,
//     });

//   } catch (error) {
//     console.error("API program update error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    console.log("LOGGING : API received program deletion request for ID:", id);

    const result = await deleteProgram(id);

    if (!result.success) {
      console.error("LOGGING : Failed to delete program:", result.error);
      return NextResponse.json({ error: result.error }, { status: 500 });
    } else {
      if (!result.data) {
        return NextResponse.json(
          { error: "Program creation failed" },
          { status: 500 }
        );
      }
      const data = await saveNotification({
        program_id: result.data.id,
        title: `A Program Has Been Deleted - ${result?.data.course_name}`,
        description: `A program has been deleted.

        Program Details:
        - University: ${result.data.university}
        - Previous/Current Study: ${result.data.previous_or_current_study}
        - Degree Going For: ${result.data.degree_going_for}
        - Course Name: ${result.data.course_name}
        - IELTS Requirement: ${result.data.ielts_requirement}
        - Special Requirements: ${result.data.special_requirements || "None"}
        - Remarks: ${result.data.remarks || "None"}
        - Deleted At: ${new Date().toLocaleString()}`,
      });
    }

    console.log("LOGGING : Program deleted successfully via API");
    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("API program deletion error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
