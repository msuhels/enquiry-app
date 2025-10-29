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

    // Create lookup maps (lowercase name -> id)
    const degreeMap = new Map<string, string>();
    const studyMap = new Map<string, string>();

    degreesResult.data?.forEach(item => {
      if (item.name) {
        degreeMap.set(item.name.toLowerCase().trim(), item.id);
      }
    });

    studiesResult.data?.forEach(item => {
      if (item.name) {
        studyMap.set(item.name.toLowerCase().trim(), item.id);
      }
    });

    // Step 2: Identify missing values that need to be created
    const missingDegrees = new Set<string>();
    const missingStudies = new Set<string>();

    body.forEach((record: BulkProgramInput) => {
      if (record.degree_going_for) {
        const normalized = record.degree_going_for.toLowerCase().trim();
        if (!degreeMap.has(normalized)) {
          missingDegrees.add(record.degree_going_for.trim());
        }
      }

      if (record.previous_or_current_study) {
        const normalized = record.previous_or_current_study.toLowerCase().trim();
        if (!studyMap.has(normalized)) {
          missingStudies.add(record.previous_or_current_study.trim());
        }
      }
    });

    // Step 3: Bulk insert missing degrees and studies
    if (missingDegrees.size > 0) {
      console.log(`LOGGING : Creating ${missingDegrees.size} new degrees`);
      const newDegrees = Array.from(missingDegrees).map(name => ({ name }));
      
      const { data: createdDegrees, error: degreeError } = await supabase
        .from("degree_going_for")
        .insert(newDegrees)
        .select("id, name");

      if (degreeError) {
        console.error("LOGGING : Failed to create new degrees:", degreeError);
        return NextResponse.json(
          { error: "Failed to create new degree entries" },
          { status: 500 }
        );
      }

      // Add newly created degrees to the map
      createdDegrees?.forEach(item => {
        if (item.name) {
          degreeMap.set(item.name.toLowerCase().trim(), item.id);
        }
      });
    }

    if (missingStudies.size > 0) {
      console.log(`LOGGING : Creating ${missingStudies.size} new studies`);
      const newStudies = Array.from(missingStudies).map(name => ({ name }));
      
      const { data: createdStudies, error: studyError } = await supabase
        .from("previous_or_current_study")
        .insert(newStudies)
        .select("id, name");

      if (studyError) {
        console.error("LOGGING : Failed to create new studies:", studyError);
        return NextResponse.json(
          { error: "Failed to create new study entries" },
          { status: 500 }
        );
      }

      // Add newly created studies to the map
      createdStudies?.forEach(item => {
        if (item.name) {
          studyMap.set(item.name.toLowerCase().trim(), item.id);
        }
      });
    }

    // Step 4: Process all programs and map IDs
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

        // Map degree_going_for to UUID
        if (record.degree_going_for) {
          const normalized = record.degree_going_for.toLowerCase().trim();
          const degreeId = degreeMap.get(normalized);
          
          if (!degreeId) {
            throw new Error(`Degree not found: ${record.degree_going_for}`);
          }
          processedProgram.degree_going_for = degreeId;
        }

        // Map previous_or_current_study to UUID
        if (record.previous_or_current_study) {
          const normalized = record.previous_or_current_study.toLowerCase().trim();
          const studyId = studyMap.get(normalized);
          
          if (!studyId) {
            throw new Error(`Study not found: ${record.previous_or_current_study}`);
          }
          processedProgram.previous_or_current_study = studyId;
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

    // Step 5: Bulk insert all programs
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

// import { createServiceRoleClient } from "@/lib/supabase/adapters/service-role";
// import { NextRequest, NextResponse } from "next/server";

// interface CustomFieldEntry {
//   field: string;
//   comparison: string;
//   value: number | string;
// }

// interface ProgramInput {
//   university: string;
//   programme_name: string;
//   study_level?: string;
//   study_area?: string;
//   campus?: string;
//   duration?: string;
//   open_intake?: string;
//   open_call?: string;
//   application_deadline?: string;
//   entry_requirements?: string;
//   moi?: string;
//   arched_test?: string;
//   additional_requirements?: string;
//   remarks?: string;
//   custom_fields?: CustomFieldEntry[];
//   [key: string]: any;
// }

// interface BulkUploadResult {
//   success: boolean;
//   total: number;
//   created: number;
//   failed: number;
//   errors: Array<{
//     index: number;
//     programme_name: string;
//     error: string;
//   }>;
// }

// // Configuration
// const BATCH_SIZE = 50; 
// const PROGRAM_INSERT_BATCH = 100; 
// const PARALLEL_BATCHES = 3; 

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     console.log("LOGGING : API received bulk program creation request");

//     // Validate input
//     if (!Array.isArray(body) || body.length === 0) {
//       return NextResponse.json(
//         { error: "Request body must be a non-empty array of programs" },
//         { status: 400 }
//       );
//     }

//     console.log(`LOGGING : Processing ${body.length} programs in optimized batches`);

//     const result: BulkUploadResult = {
//       success: true,
//       total: body.length,
//       created: 0,
//       failed: 0,
//       errors: [],
//     };

//     // STEP 1: Extract all unique custom field names from entire dataset
//     console.log("LOGGING : Extracting unique custom field names...");
//     const allCustomFieldNames = extractUniqueCustomFieldNames(body);
//     console.log(`LOGGING : Found ${allCustomFieldNames.size} unique custom field names`);

//     // STEP 2: Pre-fetch existing custom fields
//     console.log("LOGGING : Fetching existing custom fields...");
//     const customFieldsCache = await fetchAllCustomFields();
//     console.log(`LOGGING : Found ${customFieldsCache.size} existing custom fields in database`);

//     // STEP 3: Pre-create all missing custom fields in one batch
//     if (allCustomFieldNames.size > 0) {
//       console.log("LOGGING : Pre-creating missing custom fields...");
//       await preCreateCustomFields(allCustomFieldNames, customFieldsCache);
//       console.log(`LOGGING : Cache now contains ${customFieldsCache.size} custom fields`);
//     }

//     // STEP 4: Split into batches
//     const batches = chunkArray(body, BATCH_SIZE);
    
//     // STEP 5: Process batches in parallel (limited concurrency)
//     for (let i = 0; i < batches.length; i += PARALLEL_BATCHES) {
//       const parallelBatches = batches.slice(i, i + PARALLEL_BATCHES);
//       const batchPromises = parallelBatches.map((batch, idx) => 
//         processBatch(batch, i + idx, customFieldsCache, result)
//       );
      
//       await Promise.all(batchPromises);
      
//       console.log(
//         `LOGGING : Processed ${Math.min((i + PARALLEL_BATCHES) * BATCH_SIZE, body.length)}/${body.length} programs`
//       );
//     }

//     // Determine overall success
//     result.success = result.failed === 0;
//     const statusCode = result.success ? 201 : result.created > 0 ? 207 : 400;

//     console.log(
//       `LOGGING : Bulk upload completed. Created: ${result.created}, Failed: ${result.failed}`
//     );

//     return NextResponse.json(result, { status: statusCode });
//   } catch (error) {
//     console.error("API bulk program creation error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// function extractUniqueCustomFieldNames(programs: ProgramInput[]): Map<string, string> {
//   const uniqueFieldNames = new Map<string, string>(); 

//   programs.forEach((program) => {
//     if (program.custom_fields && Array.isArray(program.custom_fields)) {
//       program.custom_fields.forEach((customField) => {
//         if (customField.field && customField.field.trim()) {
//           const originalCasing = customField.field.trim();
//           const lowercaseKey = originalCasing.toLowerCase();
          
//           if (!uniqueFieldNames.has(lowercaseKey)) {
//             uniqueFieldNames.set(lowercaseKey, originalCasing);
//           }
//         }
//       });
//     }
//   });

//   return uniqueFieldNames;
// }

// async function preCreateCustomFields(
//   allFieldNamesMap: Map<string, string>, 
//   cache: Map<string, string>
// ): Promise<void> {
//   try {
//     const missingFields: Array<{ lowercase: string; original: string }> = [];
    
//     allFieldNamesMap.forEach((originalCasing, lowercaseKey) => {
//       if (!cache.has(lowercaseKey)) {
//         missingFields.push({ lowercase: lowercaseKey, original: originalCasing });
//       }
//     });

//     if (missingFields.length === 0) {
//       console.log("LOGGING : All custom fields already exist in database");
//       return;
//     }

//     console.log(`LOGGING : Creating ${missingFields.length} new custom fields...`);

//     const supabase = createServiceRoleClient();

//     const fieldsToInsert = missingFields.map((field) => ({
//       field_name: field.original, 
//     }));

//     const { data: createdFields, error } = await supabase
//       .from("custom_fields")
//       .insert(fieldsToInsert)
//       .select("id, field_name");

//     if (error) {
//       console.error("Error creating custom fields:", error);
//       throw error;
//     }

//     createdFields?.forEach((field) => {
//       cache.set(field.field_name.toLowerCase(), field.id);
//     });

//     console.log(`LOGGING : Successfully created and cached ${createdFields?.length || 0} custom fields`);
//   } catch (error) {
//     console.error("Error in preCreateCustomFields:", error);
//     throw error;
//   }
// }

// async function processBatch(
//   programs: ProgramInput[],
//   batchIndex: number,
//   customFieldsCache: Map<string, string>,
//   result: BulkUploadResult
// ) {
//   try {
//     const supabase = createServiceRoleClient();
//     const now = new Date().toISOString();

//     const programsWithCustomFields: Array<{ 
//       program: any; 
//       customFields: CustomFieldEntry[]; 
//       originalIndex: number 
//     }> = [];
//     const programsWithoutCustomFields: any[] = [];

//     programs.forEach((program, idx) => {
//       const { custom_fields = [], ...rest } = program;
//       const programData = {
//         ...rest,
//         created_at: now,
//         updated_at: now,
//       };

//       if (custom_fields.length > 0) {
//         programsWithCustomFields.push({
//           program: programData,
//           customFields: custom_fields,
//           originalIndex: batchIndex * BATCH_SIZE + idx,
//         });
//       } else {
//         programsWithoutCustomFields.push(programData);
//       }
//     });

//     if (programsWithoutCustomFields.length > 0) {
//       const chunks = chunkArray(programsWithoutCustomFields, PROGRAM_INSERT_BATCH);
      
//       for (const chunk of chunks) {
//         const { data, error } = await supabase
//           .from("programs")
//           .insert(chunk)
//           .select("id");

//         if (error) {
//           console.error("Batch insert error:", error);
//           result.failed += chunk.length;
//           chunk.forEach((p, idx) => {
//             result.errors.push({
//               index: batchIndex * BATCH_SIZE + idx,
//               programme_name: p.programme_name || "Unknown",
//               error: error.message,
//             });
//           });
//         } else {
//           result.created += data.length;
//         }
//       }
//     }

//     for (const { program, customFields, originalIndex } of programsWithCustomFields) {
//       try {
//         const { data: programData, error: programError } = await supabase
//           .from("programs")
//           .insert(program)
//           .select("id")
//           .single();

//         if (programError) throw programError;

//         const programId = programData.id;

//         const customFieldEntries = prepareCustomFieldEntries(
//           customFields,
//           programId,
//           customFieldsCache
//         );

//         if (customFieldEntries.length > 0) {
//           const { error: insertCustomError } = await supabase
//             .from("custom_programs_fields")
//             .insert(customFieldEntries);

//           if (insertCustomError) throw insertCustomError;
//         }

//         result.created++;
//       } catch (error) {
//         result.failed++;
//         result.errors.push({
//           index: originalIndex,
//           programme_name: program.programme_name || "Unknown",
//           error: error instanceof Error ? error.message : "Unknown error",
//         });
//       }
//     }
//   } catch (error) {
//     console.error(`Error processing batch ${batchIndex}:`, error);
//   }
// }

// async function fetchAllCustomFields(): Promise<Map<string, string>> {
//   try {
//     const supabase = createServiceRoleClient();
//     const { data, error } = await supabase
//       .from("custom_fields")
//       .select("id, field_name");

//     if (error) throw error;

//     const cache = new Map<string, string>();
//     data?.forEach((field) => {
//       cache.set(field.field_name.toLowerCase(), field.id);
//     });

//     return cache;
//   } catch (error) {
//     console.error("Error fetching custom fields:", error);
//     return new Map();
//   }
// }

// function prepareCustomFieldEntries(
//   customFields: CustomFieldEntry[],
//   programId: string,
//   cache: Map<string, string>
// ): any[] {
//   const entries = [];

//   for (const field of customFields) {
//     const fieldName = field.field.trim().toLowerCase();
//     const fieldId = cache.get(fieldName);

//     if (fieldId) {
//       entries.push({
//         program_id: programId,
//         custom_field: fieldId,
//         field_value: field.value?.toString() || "",
//         comparision: field.comparison || ">",
//       });
//     } else {
//       console.warn(`Custom field "${field.field}" not found in cache`);
//     }
//   }

//   return entries;
// }

// function chunkArray<T>(array: T[], size: number): T[][] {
//   const chunks: T[][] = [];
//   for (let i = 0; i < array.length; i += size) {
//     chunks.push(array.slice(i, i + size));
//   }
//   return chunks;
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