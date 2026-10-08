import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/adapters/server";
import { INACTIVE_ACCOUNT_MESSAGE } from "@/lib/auth-messages";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { data: userDetails, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error(error);
    return new NextResponse("Error fetching user details", { status: 500 });
  }

  if (userDetails.is_active === false) {
    return NextResponse.json(
      { error: "inactive", message: INACTIVE_ACCOUNT_MESSAGE },
      { status: 403 }
    );
  }

  return NextResponse.json({
    userDetails,
  });
}
