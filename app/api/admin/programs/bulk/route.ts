import { createServiceRoleClient } from "@/lib/supabase/adapters/service-role";
import { NextRequest, NextResponse } from "next/server";

interface CustomFieldEntry {
  field: string;
  comparison: string;
  value: number | string;
}

interface ProgramInput {
  university: string;
  programme_name: string;
  study_level?: string;
  study_area?: string;
  campus?: string;
  duration?: string;
  open_intake?: string;
  open_call?: string;
  application_deadline?: string;
  entry_requirements?: string;
  moi?: string;
  arched_test?: string;
  additional_requirements?: string;
  remarks?: string;
  custom_fields?: CustomFieldEntry[];
  [key: string]: any;
}

interface BulkUploadResult {
  success: boolean;
  total: number;
  created: number;
  failed: number;
  errors: Array<{
    index: number;
    programme_name: string;
    error: string;
  }>;
}

// Configuration
const BATCH_SIZE = 50; 
const PROGRAM_INSERT_BATCH = 100; 
const PARALLEL_BATCHES = 3; 

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("LOGGING : API received bulk program creation request");

    // Validate input
    if (!Array.isArray(body) || body.length === 0) {
      return NextResponse.json(
        { error: "Request body must be a non-empty array of programs" },
        { status: 400 }
      );
    }

    console.log(`LOGGING : Processing ${body.length} programs in optimized batches`);

    const result: BulkUploadResult = {
      success: true,
      total: body.length,
      created: 0,
      failed: 0,
      errors: [],
    };

    // STEP 1: Extract all unique custom field names from entire dataset
    console.log("LOGGING : Extracting unique custom field names...");
    const allCustomFieldNames = extractUniqueCustomFieldNames(body);
    console.log(`LOGGING : Found ${allCustomFieldNames.size} unique custom field names`);

    // STEP 2: Pre-fetch existing custom fields
    console.log("LOGGING : Fetching existing custom fields...");
    const customFieldsCache = await fetchAllCustomFields();
    console.log(`LOGGING : Found ${customFieldsCache.size} existing custom fields in database`);

    // STEP 3: Pre-create all missing custom fields in one batch
    if (allCustomFieldNames.size > 0) {
      console.log("LOGGING : Pre-creating missing custom fields...");
      await preCreateCustomFields(allCustomFieldNames, customFieldsCache);
      console.log(`LOGGING : Cache now contains ${customFieldsCache.size} custom fields`);
    }

    // STEP 4: Split into batches
    const batches = chunkArray(body, BATCH_SIZE);
    
    // STEP 5: Process batches in parallel (limited concurrency)
    for (let i = 0; i < batches.length; i += PARALLEL_BATCHES) {
      const parallelBatches = batches.slice(i, i + PARALLEL_BATCHES);
      const batchPromises = parallelBatches.map((batch, idx) => 
        processBatch(batch, i + idx, customFieldsCache, result)
      );
      
      await Promise.all(batchPromises);
      
      console.log(
        `LOGGING : Processed ${Math.min((i + PARALLEL_BATCHES) * BATCH_SIZE, body.length)}/${body.length} programs`
      );
    }

    // Determine overall success
    result.success = result.failed === 0;
    const statusCode = result.success ? 201 : result.created > 0 ? 207 : 400;

    console.log(
      `LOGGING : Bulk upload completed. Created: ${result.created}, Failed: ${result.failed}`
    );

    return NextResponse.json(result, { status: statusCode });
  } catch (error) {
    console.error("API bulk program creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function extractUniqueCustomFieldNames(programs: ProgramInput[]): Map<string, string> {
  const uniqueFieldNames = new Map<string, string>(); 

  programs.forEach((program) => {
    if (program.custom_fields && Array.isArray(program.custom_fields)) {
      program.custom_fields.forEach((customField) => {
        if (customField.field && customField.field.trim()) {
          const originalCasing = customField.field.trim();
          const lowercaseKey = originalCasing.toLowerCase();
          
          if (!uniqueFieldNames.has(lowercaseKey)) {
            uniqueFieldNames.set(lowercaseKey, originalCasing);
          }
        }
      });
    }
  });

  return uniqueFieldNames;
}

async function preCreateCustomFields(
  allFieldNamesMap: Map<string, string>, 
  cache: Map<string, string>
): Promise<void> {
  try {
    const missingFields: Array<{ lowercase: string; original: string }> = [];
    
    allFieldNamesMap.forEach((originalCasing, lowercaseKey) => {
      if (!cache.has(lowercaseKey)) {
        missingFields.push({ lowercase: lowercaseKey, original: originalCasing });
      }
    });

    if (missingFields.length === 0) {
      console.log("LOGGING : All custom fields already exist in database");
      return;
    }

    console.log(`LOGGING : Creating ${missingFields.length} new custom fields...`);

    const supabase = createServiceRoleClient();

    const fieldsToInsert = missingFields.map((field) => ({
      field_name: field.original, 
    }));

    const { data: createdFields, error } = await supabase
      .from("custom_fields")
      .insert(fieldsToInsert)
      .select("id, field_name");

    if (error) {
      console.error("Error creating custom fields:", error);
      throw error;
    }

    createdFields?.forEach((field) => {
      cache.set(field.field_name.toLowerCase(), field.id);
    });

    console.log(`LOGGING : Successfully created and cached ${createdFields?.length || 0} custom fields`);
  } catch (error) {
    console.error("Error in preCreateCustomFields:", error);
    throw error;
  }
}

async function processBatch(
  programs: ProgramInput[],
  batchIndex: number,
  customFieldsCache: Map<string, string>,
  result: BulkUploadResult
) {
  try {
    const supabase = createServiceRoleClient();
    const now = new Date().toISOString();

    const programsWithCustomFields: Array<{ 
      program: any; 
      customFields: CustomFieldEntry[]; 
      originalIndex: number 
    }> = [];
    const programsWithoutCustomFields: any[] = [];

    programs.forEach((program, idx) => {
      const { custom_fields = [], ...rest } = program;
      const programData = {
        ...rest,
        created_at: now,
        updated_at: now,
      };

      if (custom_fields.length > 0) {
        programsWithCustomFields.push({
          program: programData,
          customFields: custom_fields,
          originalIndex: batchIndex * BATCH_SIZE + idx,
        });
      } else {
        programsWithoutCustomFields.push(programData);
      }
    });

    if (programsWithoutCustomFields.length > 0) {
      const chunks = chunkArray(programsWithoutCustomFields, PROGRAM_INSERT_BATCH);
      
      for (const chunk of chunks) {
        const { data, error } = await supabase
          .from("programs")
          .insert(chunk)
          .select("id");

        if (error) {
          console.error("Batch insert error:", error);
          result.failed += chunk.length;
          chunk.forEach((p, idx) => {
            result.errors.push({
              index: batchIndex * BATCH_SIZE + idx,
              programme_name: p.programme_name || "Unknown",
              error: error.message,
            });
          });
        } else {
          result.created += data.length;
        }
      }
    }

    for (const { program, customFields, originalIndex } of programsWithCustomFields) {
      try {
        const { data: programData, error: programError } = await supabase
          .from("programs")
          .insert(program)
          .select("id")
          .single();

        if (programError) throw programError;

        const programId = programData.id;

        const customFieldEntries = prepareCustomFieldEntries(
          customFields,
          programId,
          customFieldsCache
        );

        if (customFieldEntries.length > 0) {
          const { error: insertCustomError } = await supabase
            .from("custom_programs_fields")
            .insert(customFieldEntries);

          if (insertCustomError) throw insertCustomError;
        }

        result.created++;
      } catch (error) {
        result.failed++;
        result.errors.push({
          index: originalIndex,
          programme_name: program.programme_name || "Unknown",
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }
  } catch (error) {
    console.error(`Error processing batch ${batchIndex}:`, error);
  }
}

async function fetchAllCustomFields(): Promise<Map<string, string>> {
  try {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("custom_fields")
      .select("id, field_name");

    if (error) throw error;

    const cache = new Map<string, string>();
    data?.forEach((field) => {
      cache.set(field.field_name.toLowerCase(), field.id);
    });

    return cache;
  } catch (error) {
    console.error("Error fetching custom fields:", error);
    return new Map();
  }
}

function prepareCustomFieldEntries(
  customFields: CustomFieldEntry[],
  programId: string,
  cache: Map<string, string>
): any[] {
  const entries = [];

  for (const field of customFields) {
    const fieldName = field.field.trim().toLowerCase();
    const fieldId = cache.get(fieldName);

    if (fieldId) {
      entries.push({
        program_id: programId,
        custom_field: fieldId,
        field_value: field.value?.toString() || "",
        comparision: field.comparison || ">",
      });
    } else {
      console.warn(`Custom field "${field.field}" not found in cache`);
    }
  }

  return entries;
}

function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}



/** ---> Program sample data */
const programs = [
  {
    university: "mist",
    programme_name: "sdfs",
    study_level: "",
    study_area: "",
    campus: "",
    duration: "",
    open_intake: "",
    open_call: "",
    application_deadline: "",
    entry_requirements: "",
    moi: "",
    arched_test: "",
    additional_requirements: "",
    remarks: "",
    custom_fields: [
      {
        field: "Abhi score",
        comparison: ">",
        value: 90,
      },
      {
        field: "The score",
        comparison: ">",
        value: 98,
      },
    ],
  },
   {
    university: "mist",
    programme_name: "sdfs smoef",
    study_level: "",
    study_area: "",
    campus: "",
    duration: "",
    open_intake: "",
    open_call: "",
    application_deadline: "",
    entry_requirements: "",
    moi: "",
    arched_test: "",
    additional_requirements: "",
    remarks: "",
    custom_fields: [
      {
        field: "Abhi score",
        comparison: ">",
        value: 90,
      },
      {
        field: "The score",
        comparison: ">",
        value: 98,
      },
      {
        field: "P score",
        comparison: "<",
        value: 90,
      },
    ],
  },
];
