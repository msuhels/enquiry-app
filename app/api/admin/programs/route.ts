import { NextRequest, NextResponse } from "next/server";
import {
  createProgram,
  getPrograms,
} from "@/lib/supabase/program/admin-program.services";
import {  Program } from "@/lib/types";

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
      pagination : result.pagination
    });
  } catch (error) {
    console.error("API programs fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}



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
      remarks 
    } = body;

    const hasProgramData = [
      university, 
      previous_or_current_study, 
      degree_going_for, 
      course_name, 
      ielts_requirement, 
      special_requirements, 
      remarks
    ].some(value => 
      value !== null && 
      value !== undefined && 
      value.toString().trim() !== ""
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
    } as Program

    const result = await createProgram(programData);

    if (!result.success) {
      console.error("LOGGING : Failed to create program:", result.error);
      return NextResponse.json({ error: result.error }, { status: 500 });
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
