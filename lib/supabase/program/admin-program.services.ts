"use server";

import { CustomFieldEntry, Program } from './../../types';
import { createServiceRoleClient } from "@/lib/supabase/adapters/service-role";
import { BulkUploadResult, Program } from "@/lib/types";


export interface ProgramServiceResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}


export async function createProgram(
  programData: Program
): Promise<ProgramServiceResult<Program>> {
  try {
    const supabase = createServiceRoleClient();

    const programRecord = {
      ...programData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("programs")
      .insert([programRecord])
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


export async function updateProgram(
  programId: string,
  programData: Partial<Program>
): Promise<ProgramServiceResult<Program>> {
  try {
    const supabase = createServiceRoleClient();

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


export async function deleteProgram(
  programId: string
): Promise<ProgramServiceResult> {
  try {
    const supabase = createServiceRoleClient();

    const { error: fieldError } = await supabase
    .from("custom_programs_fields")
    .delete()
    .eq("program_id", programId);

  if (fieldError) return { success: false, error: fieldError.message };

    const { error } = await supabase
      .from("programs")
      .delete()
      .eq("id", programId);

    if (error) {
      console.error("Admin program deletion error:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Admin program deletion unexpected error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}


export async function getProgramById(
  programId: string
): Promise<ProgramServiceResult<Program>> {
  try {
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from("programs")
      .select("*")
      .eq("id", programId)
      .single();

    if (error) {
      console.error("Admin program fetch error:", error);
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
    console.error("Admin program fetch unexpected error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}


export async function getPrograms(filters: any) {
  const { university, study_level, study_area, search, limit = 10, offset = 0 } = filters;
  const supabase = createServiceRoleClient();

  try {
    // Base query
    let query = supabase.from("programs").select("*", { count: "exact" });

    // Apply filters
    if (university) query = query.ilike("university", `%${university}%`);
    if (study_level) query = query.ilike("study_level", `%${study_level}%`);
    if (study_area) query = query.ilike("study_area", `%${study_area}%`);
    if (search) {
      query = query.or(
        `university.ilike.%${search}%,programme_name.ilike.%${search}%,study_area.ilike.%${search}%`
      );
    }

    // Pagination
    query = query.order("created_at", { ascending: false });
    if (limit && offset !== undefined) query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error("Supabase getPrograms error:", error);
      return { success: false, error: error.message };
    }

    const pagination = {
      limit,
      offset,
      total: count ?? 0,
      totalPages: Math.ceil((count ?? 0) / limit),
    };

    return { success: true, data, pagination };
  } catch (err) {
    console.error("Unexpected getPrograms error:", err);
    return { success: false, error: "Unexpected error fetching programs" };
  }
}



export async function bulkCreatePrograms(
  programs: Program[]
): Promise<ProgramServiceResult<Program[]>> {
  try {
    const supabase = createServiceRoleClient();

    const programRecords = programs.map((program) => ({
      ...program,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    const { data, error } = await supabase
      .from("programs")
      .insert(programRecords)
      .select();

    if (error) {
      console.error("Admin bulk program creation error:", error);
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
    console.error("Admin bulk program creation unexpected error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function bulkCreateProgramsWithValidation(
  programs: Program[]
): Promise<BulkUploadResult> {
  const supabase = createServiceRoleClient();
  const batchSize = 100;
  const results: BulkUploadResult = {
    success: true,
    total: programs.length,
    successful: 0,
    failed: 0,
    errors: [],
    data: [],
  };

  try {
    // Process in batches
    for (let i = 0; i < programs.length; i += batchSize) {
      const batch = programs.slice(i, i + batchSize);

      const programRecords = batch.map((program) => ({
        ...program,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));

      const { data, error } = await supabase
        .from("programs")
        .insert(programRecords)
        .select();

      if (error) {
        // If batch fails, try inserting one by one
        console.log(
          `Batch ${i / batchSize + 1} failed, trying individual inserts...`
        );

        for (let j = 0; j < batch.length; j++) {
          const singleProgram = {
            ...batch[j],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          const { data: singleData, error: singleError } = await supabase
            .from("programs")
            .insert([singleProgram])
            .select()
            .single();

          if (singleError) {
            results.failed++;
            results.errors.push({
              row: i + j + 1,
              program: batch[j],
              error: singleError.message,
            });
          } else {
            results.successful++;
            results.data?.push(singleData);
          }
        }
      } else {
        results.successful += data.length;
        results.data?.push(...data);
      }
    }

    results.success = results.failed === 0;
    return results;
  } catch (error) {
    console.error("Admin bulk program creation with validation error:", error);
    return {
      success: false,
      total: programs.length,
      successful: results.successful,
      failed: programs.length - results.successful,
      errors: [
        {
          row: 0,
          program: {},
          error:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
        },
      ],
    };
  }
}


export async function createCustomProgramFields(customFields:CustomFieldEntry[]){
  try {
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from("custom_programs_fields")
      .insert(customFields)
      .select();

    if (error) {
      console.error("Admin custom field creation error:", error);
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
    console.error("Admin custom field creation unexpected error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}


export async function getAvailableCustomFields(){
  try {
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from("custom_fields")
      .select();

    if (error) {
      console.error("Admin custom field creation error:", error);
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
    console.error("Admin custom field creation unexpected error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

export async function processCustomFields(customFields: CustomFieldEntry[], programId: string | undefined) {
  try {
    const supabase = createServiceRoleClient();
    const customFieldEntries = [];

    for (const field of customFields) {
      const fieldName = field.field.trim().toLowerCase();

      // Check if field exists
      const { data: existingFields, error: selectError } = await supabase
        .from("custom_fields")
        .select("id, field_name");

      if (selectError) throw selectError;

      let fieldId = existingFields?.find(f => f.field_name.toLowerCase() === fieldName)?.id;

      // If not exists, create it
      if (!fieldId) {
        const { data: newField, error: insertError } = await supabase
          .from("custom_fields")
          .insert({ field_name: field.field.trim() })
          .select()
          .single();

        if (insertError) throw insertError;
        fieldId = newField.id;
      }

      // Push to array for inserting into custom_programs_fields
      customFieldEntries.push({
        program_id: programId,
        custom_field: fieldId,
        field_value: field.value?.toString() || "",
      });
    }

    // Insert all custom program fields at once
    const { error: insertCustomError } = await supabase
      .from("custom_programs_fields")
      .insert(customFieldEntries);

    if (insertCustomError) throw insertCustomError;

    return { success: true };
  } catch (error) {
    console.error("Error processing custom fields:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unexpected error",
    };
  }
}