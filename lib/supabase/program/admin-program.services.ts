"use server";
import { createServiceRoleClient } from "@/lib/supabase/adapters/service-role";
import { BulkUploadResult, Program } from "@/lib/types";

/**
 * Admin Program Service - Uses service role to bypass RLS
 * This should only be used in server-side contexts for administrative operations
 */

export interface ProgramServiceResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Create a new program using service role (bypasses RLS)
 */
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

/**
 * Update an existing program using service role
 */
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

/**
 * Delete a program using service role
 */
export async function deleteProgram(
  programId: string
): Promise<ProgramServiceResult> {
  try {
    const supabase = createServiceRoleClient();

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

/**
 * Get a single program by ID using service role
 */
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

/**
 * Get all programs with optional filters using service role
 */
export async function getPrograms(filters?: {
  university?: string;
  study_level?: string;
  study_area?: string;
  limit?: number;
  offset?: number;
}): Promise<ProgramServiceResult<Program[]>> {
  try {
    const supabase = createServiceRoleClient();

    let query = supabase.from("programs").select("*");

    if (filters?.university) {
      query = query.ilike("university", `%${filters.university}%`);
    }
    if (filters?.study_level) {
      query = query.eq("study_level", filters.study_level);
    }
    if (filters?.study_area) {
      query = query.ilike("study_area", `%${filters.study_area}%`);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    if (filters?.offset) {
      query = query.range(
        filters.offset,
        filters.offset + (filters.limit || 10) - 1
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error("Admin programs fetch error:", error);
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
    console.error("Admin programs fetch unexpected error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

/**
 * Bulk create programs using service role (useful for CSV imports)
 */
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

/**
 * Bulk create programs with detailed error handling
 * Processes programs in batches and continues on individual failures
 */
export async function bulkCreateProgramsWithValidation(
  programs: Program[]
): Promise<BulkUploadResult> {
  const supabase = createServiceRoleClient();
  const batchSize = 100; // Process 100 programs at a time
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
