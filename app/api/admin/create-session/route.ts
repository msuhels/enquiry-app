// app/api/admin/create-session/route.ts
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { access_token, device_info, ip_address, user_agent } =
      await request.json();

    if (!access_token) {
      return NextResponse.json(
        { error: "Access token is required" },
        { status: 400 }
      );
    }

    const supabaseUser = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      }
    );

    const {
      data: { user },
      error: userError,
    } = await supabaseUser.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Invalid access token" }, { status: 401 });
    }

    // Get client IP
    const forwarded = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const clientIp = forwarded?.split(",")[0] || realIp || ip_address || "unknown";

    /** ✅ 1) DELETE previous active session(s) */
    await supabaseAdmin
      .from("user_sessions")
      .delete()
      .eq("user_id", user.id);

    /** ✅ 2) INSERT new session */
    const { data: session, error: sessionError } = await supabaseAdmin
      .from("user_sessions")
      .insert({
        user_id: user.id,
        session_token: access_token,
        device_info: device_info || "Unknown",
        ip_address: clientIp,
        user_agent: user_agent || "Unknown",
        is_active: true,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      })
      .select()
      .single();

    if (sessionError) {
      return NextResponse.json(
        { error: "Failed to create session", details: sessionError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Last session deleted & new session created",
      session: {
        id: session.id,
        created_at: session.created_at,
        device_info: session.device_info,
      },
    });

  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
