// app/api/programs/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  createCustomProgramFields,
  createProgram,
  getPrograms,
  processCustomFields,
} from "@/lib/supabase/program/admin-program.services";
import { CustomFieldEntry } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const filters = {
      university: searchParams.get("university") || undefined,
      study_level: searchParams.get("study_level") || undefined,
      study_area: searchParams.get("study_area") || undefined,
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
    });
  } catch (error) {
    console.error("API programs fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create a new program
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("LOGGING : API received program creation request");

    const { custom_fields = [], ...rest } = body;

    // Check if any meaningful data is present
    const hasProgramData =
      Object.values(rest).some(
        (value) => value !== null && value !== undefined && value.toString().trim() !== ""
      ) ||
      custom_fields.some(
        (field: CustomFieldEntry) => field.value !== null && field.value !== undefined && field.value.toString().trim() !== ""
      );

    if (!hasProgramData) {
      return NextResponse.json(
        { error: "At least one field is required" },
        { status: 400 }
      );
    }

    // Create program first
    const programData = {
      ...rest,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const result = await createProgram(programData);

    if (!result.success) {
      console.error("LOGGING : Failed to create program:", result.error);
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    const programId = result.data?.id;

    // Process custom fields if any
    if (custom_fields.length > 0) {
      const processedCustomFields = await processCustomFields(custom_fields, programId);

      if (!processedCustomFields.success) {
        console.error("LOGGING : Failed to save custom fields:", processedCustomFields.error);
        return NextResponse.json({ error: processedCustomFields.error }, { status: 500 });
      }
    }

    console.log("LOGGING : Program created successfully via API");
    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    console.error("API program creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

