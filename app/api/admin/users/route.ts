import { NextRequest, NextResponse } from "next/server";
import { createUser, getUser, getUsers } from "@/lib/supabase/auth-module/services/admin-user.services";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;
    
    console.log("LOGGING : API received user creation request:", { email });

    const result = await createUser({user:body, email});
    
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

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("id");

    if (userId) {
      // GET user by ID
      const result = await getUser(userId);
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }
      return NextResponse.json({ success: true, data: result.data });
    }

    // GET all users
    const result = await getUsers();
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    console.error("API user fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}