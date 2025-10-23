import { bulkCreateUsersWithValidation } from "@/lib/userBulk-upload";
import { NextRequest, NextResponse } from "next/server";

// route.ts - API Route Handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { users, filename } = body;

    if (!Array.isArray(users)) {
      return NextResponse.json(
        { error: "Users must be an array" },
        { status: 400 }
      );
    }

    if (users.length === 0) {
      return NextResponse.json(
        { error: "No users to upload" },
        { status: 400 }
      );
    }

    console.log(
      `LOGGING : API received bulk upload for ${users.length} users from file: ${filename}`
    );

    // Process bulk user creation
    const result = await bulkCreateUsersWithValidation(users);

    console.log(
      `LOGGING : Bulk upload completed - Success: ${result.successful}, Failed: ${result.failed}`
    );

    if (result.failed > 0) {
      console.warn(
        `LOGGING : ${result.failed} users failed to upload:`,
        result.errors
      );
    }

    return NextResponse.json(
      {
        success: result.success,
        total: result.total,
        successful: result.successful,
        failed: result.failed,
        errors: result.errors,
        data: result.data,
      },
      { status: result.success ? 200 : 207 } // 207 = Multi-Status (partial success)
    );
  } catch (error) {
    console.error("API bulk user upload error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}