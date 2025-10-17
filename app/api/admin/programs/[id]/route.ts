import { NextRequest, NextResponse } from "next/server";
import { getProgramById, updateProgram, deleteProgram } from "@/lib/supabase/program/admin-program.services";

// GET - Fetch single program by ID
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
      return NextResponse.json(
        { error: result.error },
        { status: 404 }
      );
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

// PATCH - Update a program
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    console.log("LOGGING : API received program update request for ID:", id);

    const result = await updateProgram(id, body);
    
    if (!result.success) {
      console.error("LOGGING : Failed to update program:", result.error);
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
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

// DELETE - Delete a program
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
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
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