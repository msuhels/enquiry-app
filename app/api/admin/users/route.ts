import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/lib/supabase/auth-module/services/admin-user.services";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { authUserId, email } = body;
    
    console.log("LOGGING : API received user creation request:", { authUserId, email });

    // Create user using admin service (bypasses RLS)
    const result = await createUser(authUserId, email);
    
    console.log("LOGGING : Admin service result:", result);

    if (!result.success) {
      console.error("LOGGING : Failed to create user:", result.error);
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    console.log("LOGGING : User created successfully via API");
    return NextResponse.json({
      success: true,
      data: result.data,
    });

  } catch (error) {
    console.error("API user creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}