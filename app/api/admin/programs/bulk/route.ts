import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/adapters/service-role";

interface BulkProgramInput {
  university?: string;
  previous_or_current_study?: string;
  degree_going_for?: string;
  course_name?: string;
  ielts_requirement?: string;
  special_requirements?: string;
  remarks?: string;
}

interface ProcessedProgram {
  university?: string;
  previous_or_current_study?: string;
  degree_going_for?: string;
  course_name?: string;
  ielts_requirement?: string;
  special_requirements?: string | null;
  remarks?: string | null;
  created_at: string;
  updated_at: string;
}

interface FailedRecord {
  index: number;
  data: BulkProgramInput;
  error: string;
}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("LOGGING : API received bulk program upload request");

    // Validate input is an array
    if (!Array.isArray(body) || body.length === 0) {
      return NextResponse.json(
        { error: "Request body must be a non-empty array of programs" },
        { status: 400 }
      );
    }

    const supabase = createServiceRoleClient();

    // Helper function to split values intelligently
    // const splitValues = (value: string): string[] => {
    //   // If value contains parentheses, treat as single value (don't split)
    //   if (value.includes('(') || value.includes(')')) {
    //     return [value.trim()];
    //   }
      
    //   // Otherwise split by comma
    //   return value.split(',').map(v => v.trim()).filter(v => v);
    // };

    // Step 1: Fetch all existing degrees and studies ONCE
    console.log("LOGGING : Fetching reference data from database");
    
    const [degreesResult, studiesResult] = await Promise.all([
      supabase.from("degree_going_for").select("id, name"),
      supabase.from("previous_or_current_study").select("id, name")
    ]);

    if (degreesResult.error || studiesResult.error) {
      console.error("LOGGING : Failed to fetch reference data:", {
        degreesError: degreesResult.error,
        studiesError: studiesResult.error
      });
      return NextResponse.json(
        { error: "Failed to fetch reference data from database" },
        { status: 500 }
      );
    }

    // Create lookup sets for checking existence (lowercase name)
    const existingDegrees = new Set<string>();
    const existingStudies = new Set<string>();

    degreesResult.data?.forEach(item => {
      if (item.name) {
        existingDegrees.add(item.name.toLowerCase().trim());
      }
    });

    studiesResult.data?.forEach(item => {
      if (item.name) {
        existingStudies.add(item.name.toLowerCase().trim());
      }
    });

    // Step 2: Collect all unique degrees and studies from input (NO SPLITTING - save as-is)
    const degreesMap = new Map<string, string>();
    const studiesMap = new Map<string, string>();

    body.forEach((record: BulkProgramInput) => {
      if (record.degree_going_for) {
        const degree = record.degree_going_for.trim();
        const lowerKey = degree.toLowerCase();
        if (!degreesMap.has(lowerKey)) {
          degreesMap.set(lowerKey, degree);
        }
      }

      if (record.previous_or_current_study) {
        const study = record.previous_or_current_study.trim();
        const lowerKey = study.toLowerCase();
        if (!studiesMap.has(lowerKey)) {
          studiesMap.set(lowerKey, study);
        }
      }
    });

    const allDegrees = Array.from(degreesMap.values());
    const allStudies = Array.from(studiesMap.values());

    // Step 3: Identify missing values that need to be created
    const missingDegrees = allDegrees.filter(
      degree => !existingDegrees.has(degree.toLowerCase())
    );

    const missingStudies = allStudies.filter(
      study => !existingStudies.has(study.toLowerCase())
    );

    // Step 4: Bulk insert missing degrees and studies
    if (missingDegrees.length > 0) {
      console.log(`LOGGING : Creating ${missingDegrees.length} new degrees`);
      const newDegrees = missingDegrees.map(name => ({ name }));
      
      const { error: degreeError } = await supabase
        .from("degree_going_for")
        .insert(newDegrees);

      if (degreeError) {
        console.error("LOGGING : Failed to create new degrees:", degreeError);
        return NextResponse.json(
          { error: "Failed to create new degree entries" },
          { status: 500 }
        );
      }

      // Add newly created degrees to the existing set
      missingDegrees.forEach(degree => {
        existingDegrees.add(degree.toLowerCase());
      });
    }

    if (missingStudies.length > 0) {
      console.log(`LOGGING : Creating ${missingStudies.length} new studies`);
      const newStudies = missingStudies.map(name => ({ name }));
      
      const { error: studyError } = await supabase
        .from("previous_or_current_study")
        .insert(newStudies);

      if (studyError) {
        console.error("LOGGING : Failed to create new studies:", studyError);
        return NextResponse.json(
          { error: "Failed to create new study entries" },
          { status: 500 }
        );
      }

      // Add newly created studies to the existing set
      missingStudies.forEach(study => {
        existingStudies.add(study.toLowerCase());
      });
    }

    // Step 5: Process all programs and store TEXT values directly
    const programsToInsert: ProcessedProgram[] = [];
    const failedRecords: FailedRecord[] = [];
    const timestamp = new Date().toISOString();

    body.forEach((record: BulkProgramInput, index: number) => {
      try {
        const processedProgram: ProcessedProgram = {
          university: record.university,
          course_name: record.course_name,
          ielts_requirement: record.ielts_requirement,
          special_requirements: record.special_requirements || null,
          remarks: record.remarks || null,
          created_at: timestamp,
          updated_at: timestamp,
        };

        // Store TEXT value directly (no splitting, no UUID conversion)
        if (record.degree_going_for) {
          processedProgram.degree_going_for = record.degree_going_for.trim();
        }

        // Store TEXT value directly (no splitting, no UUID conversion)
        if (record.previous_or_current_study) {
          processedProgram.previous_or_current_study = record.previous_or_current_study.trim();
        }

        programsToInsert.push(processedProgram);
      } catch (error) {
        failedRecords.push({
          index,
          data: record,
          error: error instanceof Error ? error.message : "Unknown error"
        });
      }
    });

    // Step 6: Bulk insert all programs
    let successCount = 0;
    
    if (programsToInsert.length > 0) {
      console.log(`LOGGING : Inserting ${programsToInsert.length} programs`);
      
      const { data, error } = await supabase
        .from("programs")
        .insert(programsToInsert)
        .select();

      if (error) {
        console.error("LOGGING : Failed to insert programs:", error);
        return NextResponse.json(
          { 
            error: "Failed to insert programs into database",
            details: error.message,
            successCount: 0,
            failedCount: body.length,
            failedRecords: body.map((record, index) => ({
              index,
              data: record,
              error: error.message
            }))
          },
          { status: 500 }
        );
      }

      successCount = data?.length || 0;
    }

    console.log(`LOGGING : Bulk upload completed - Success: ${successCount}, Failed: ${failedRecords.length}`);

    return NextResponse.json({
      success: true,
      successCount,
      failedCount: failedRecords.length,
      failedRecords: failedRecords.length > 0 ? failedRecords : undefined,
      message: `Successfully uploaded ${successCount} programs${failedRecords.length > 0 ? `, ${failedRecords.length} failed` : ''}`
    });

  } catch (error) {
    console.error("API bulk program upload error:", error);
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     console.log("LOGGING : API received bulk program upload request");

//     // Validate input is an array
//     if (!Array.isArray(body) || body.length === 0) {
//       return NextResponse.json(
//         { error: "Request body must be a non-empty array of programs" },
//         { status: 400 }
//       );
//     }

//     const supabase = createServiceRoleClient();

//     // Step 1: Fetch all existing degrees and studies ONCE
//     console.log("LOGGING : Fetching reference data from database");
    
//     const [degreesResult, studiesResult] = await Promise.all([
//       supabase.from("degree_going_for").select("id, name"),
//       supabase.from("previous_or_current_study").select("id, name")
//     ]);

//     if (degreesResult.error || studiesResult.error) {
//       console.error("LOGGING : Failed to fetch reference data:", {
//         degreesError: degreesResult.error,
//         studiesError: studiesResult.error
//       });
//       return NextResponse.json(
//         { error: "Failed to fetch reference data from database" },
//         { status: 500 }
//       );
//     }

//     // Create lookup sets for checking existence (lowercase name)
//     const existingDegrees = new Set<string>();
//     const existingStudies = new Set<string>();

//     degreesResult.data?.forEach(item => {
//       if (item.name) {
//         existingDegrees.add(item.name.toLowerCase().trim());
//       }
//     });

//     studiesResult.data?.forEach(item => {
//       if (item.name) {
//         existingStudies.add(item.name.toLowerCase().trim());
//       }
//     });

//     // Step 2: Collect all unique degrees and studies from input (with splitting)
//     const allDegrees = new Set<string>();
//     const allStudies = new Set<string>();

//     body.forEach((record: BulkProgramInput) => {
//       if (record.degree_going_for) {
//         // Split by comma and add each value
//         const degrees = record.degree_going_for.split(',').map(d => d.trim()).filter(d => d);
//         degrees.forEach(degree => allDegrees.add(degree));
//       }

//       if (record.previous_or_current_study) {
//         // Split by comma and add each value
//         const studies = record.previous_or_current_study.split(',').map(s => s.trim()).filter(s => s);
//         studies.forEach(study => allStudies.add(study));
//       }
//     });

//     // Step 3: Identify missing values that need to be created
//     const missingDegrees = Array.from(allDegrees).filter(
//       degree => !existingDegrees.has(degree.toLowerCase())
//     );

//     const missingStudies = Array.from(allStudies).filter(
//       study => !existingStudies.has(study.toLowerCase())
//     );

//     // Step 4: Bulk insert missing degrees and studies
//     if (missingDegrees.length > 0) {
//       console.log(`LOGGING : Creating ${missingDegrees.length} new degrees`);
//       const newDegrees = missingDegrees.map(name => ({ name }));
      
//       const { error: degreeError } = await supabase
//         .from("degree_going_for")
//         .insert(newDegrees);

//       if (degreeError) {
//         console.error("LOGGING : Failed to create new degrees:", degreeError);
//         return NextResponse.json(
//           { error: "Failed to create new degree entries" },
//           { status: 500 }
//         );
//       }

//       // Add newly created degrees to the existing set
//       missingDegrees.forEach(degree => {
//         existingDegrees.add(degree.toLowerCase());
//       });
//     }

//     if (missingStudies.length > 0) {
//       console.log(`LOGGING : Creating ${missingStudies.length} new studies`);
//       const newStudies = missingStudies.map(name => ({ name }));
      
//       const { error: studyError } = await supabase
//         .from("previous_or_current_study")
//         .insert(newStudies);

//       if (studyError) {
//         console.error("LOGGING : Failed to create new studies:", studyError);
//         return NextResponse.json(
//           { error: "Failed to create new study entries" },
//           { status: 500 }
//         );
//       }

//       // Add newly created studies to the existing set
//       missingStudies.forEach(study => {
//         existingStudies.add(study.toLowerCase());
//       });
//     }

//     // Step 5: Process all programs and store TEXT values directly
//     const programsToInsert: ProcessedProgram[] = [];
//     const failedRecords: FailedRecord[] = [];
//     const timestamp = new Date().toISOString();

//     body.forEach((record: BulkProgramInput, index: number) => {
//       try {
//         const processedProgram: ProcessedProgram = {
//           university: record.university,
//           course_name: record.course_name,
//           ielts_requirement: record.ielts_requirement,
//           special_requirements: record.special_requirements || null,
//           remarks: record.remarks || null,
//           created_at: timestamp,
//           updated_at: timestamp,
//         };

//         // Store TEXT value directly (no UUID conversion)
//         if (record.degree_going_for) {
//           processedProgram.degree_going_for = record.degree_going_for.trim();
//         }

//         // Store TEXT value directly (no UUID conversion)
//         if (record.previous_or_current_study) {
//           processedProgram.previous_or_current_study = record.previous_or_current_study.trim();
//         }

//         programsToInsert.push(processedProgram);
//       } catch (error) {
//         failedRecords.push({
//           index,
//           data: record,
//           error: error instanceof Error ? error.message : "Unknown error"
//         });
//       }
//     });

//     // Step 6: Bulk insert all programs
//     let successCount = 0;
    
//     if (programsToInsert.length > 0) {
//       console.log(`LOGGING : Inserting ${programsToInsert.length} programs`);
      
//       const { data, error } = await supabase
//         .from("programs")
//         .insert(programsToInsert)
//         .select();

//       if (error) {
//         console.error("LOGGING : Failed to insert programs:", error);
//         return NextResponse.json(
//           { 
//             error: "Failed to insert programs into database",
//             details: error.message,
//             successCount: 0,
//             failedCount: body.length,
//             failedRecords: body.map((record, index) => ({
//               index,
//               data: record,
//               error: error.message
//             }))
//           },
//           { status: 500 }
//         );
//       }

//       successCount = data?.length || 0;
//     }

//     console.log(`LOGGING : Bulk upload completed - Success: ${successCount}, Failed: ${failedRecords.length}`);

//     return NextResponse.json({
//       success: true,
//       successCount,
//       failedCount: failedRecords.length,
//       failedRecords: failedRecords.length > 0 ? failedRecords : undefined,
//       message: `Successfully uploaded ${successCount} programs${failedRecords.length > 0 ? `, ${failedRecords.length} failed` : ''}`
//     });

//   } catch (error) {
//     console.error("API bulk program upload error:", error);
//     return NextResponse.json(
//       { 
//         error: "Internal server error",
//         details: error instanceof Error ? error.message : "Unknown error"
//       },
//       { status: 500 }
//     );
//   }
// }






/** ---> Program sample data */
const programs = [
    {
        "university": "University of Milan",
        "previous_or_current_study": "Bcom,BBA,BMS",
        "degree_going_for": "Master",
        "course_name": "Management of Innovation and Entrepreneurship",
        "ielts_requirement": "Above 5.5"
    },
    {
        "university": "University of Milan",
        "previous_or_current_study": "Bcom,BBA,BMS",
        "degree_going_for": "Master",
        "course_name": "Management of Human Resources",
        "ielts_requirement": "Above 5.5"
    },
    {
        "university": "University of Milan",
        "previous_or_current_study": "Bcom,BBA,BMS",
        "degree_going_for": "Master",
        "course_name": "Finance and Economics",
        "ielts_requirement": "Above 5.5"
    },
    {
        "university": "University of Milan",
        "previous_or_current_study": "Bcom,BBA,BMS",
        "degree_going_for": "Master",
        "course_name": "International Relations (REL)",
        "ielts_requirement": "Above 5.5"
    },
    {
        "university": "University of Cassino",
        "previous_or_current_study": "Bcom,BBA,BMS",
        "degree_going_for": "Master",
        "course_name": "Global Economy And Business",
        "ielts_requirement": "Above 5.5"
    }
]