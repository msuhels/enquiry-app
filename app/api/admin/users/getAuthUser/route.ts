import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/adapters/server";

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

  return NextResponse.json({
    userDetails,
  });
}
