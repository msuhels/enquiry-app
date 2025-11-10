"use server";
import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/adapters/service-role";

export async function POST(req: Request) {
  try {
    const { user_id } = await req.json();
    const supabaseAdmin = createServiceRoleClient();

    if (!user_id) {
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
    }

    const { error } = await supabaseAdmin.rpc("delete_other_sessions", {
      p_user_id: user_id,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Deleted other sessions for user_id=${user_id}`,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
