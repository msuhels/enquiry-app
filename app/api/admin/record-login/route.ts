import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/adapters/service-role";
import { createClient } from "@/lib/supabase/adapters/server";

function normalizeIp(ip: string | null): string {
  if (!ip) return "unknown";
  if (ip.startsWith("::ffff:")) return ip.replace("::ffff:", "");
  return ip;
}

async function getGeoFromIP(ip: string) {
  try {
    // if (!ip || ip === "unknown" || ip === "127.0.0.1" || ip === "::1") {
    //   return null; // local
    // }

    const res = await fetch(`https://ipwho.is/${ip}`);
    const json = await res.json();

    if (json.success == true) {
      return {
        city: json.city,
        state: json.region,
        country: json.country,
        lat: json.latitude,
        lon: json.longitude,
        isp: json.connection.isp,
      };
    } else if (json.success == false && json.message == "Reserved range") {
      return {
        city: "localhost",
        state: "localhost",
        country: "localhost",
        lat: 0,
        lon: 0,
        isp: "localhost",
      };
    }
    return null;
  } catch (e) {
    console.error("Geo lookup failed", e);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const event_type = body.event_type as
      | "login"
      | "logout"
      | "enquiry"
      | "enquiry_created"
      | "document_download";
    const enquiry_id = body.enquiry_id as string | null;
    const document_id = body.document_id as string | null;
    const serverSupabase = await createClient();
    const session = await serverSupabase.auth.getSession();
    const access_token =
      body.access_token ||
      (session.data.session?.access_token as string | undefined);

    if (!access_token) {
      return NextResponse.json(
        { error: "Missing access token" },
        { status: 400 }
      );
    }

    let ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      req.headers.get("cf-connecting-ip") ||
      "unknown";

    ip = normalizeIp(ip);
    const userAgent = req.headers.get("user-agent") ?? "unknown";

    const supabase = await createServiceRoleClient();

    const { data: userData, error: userError } = await supabase.auth.getUser(
      access_token
    );
    if (userError || !userData?.user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    const userId = userData.user.id;

    const geo = await getGeoFromIP(ip);

    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    const metadata = {
      user,
      ip_info: geo ?? null,
    };

    if (enquiry_id) {
      metadata.enquiry_id = enquiry_id;
    }

    if (document_id) {
      metadata.document_id = document_id;
    }

    const { error: insertError } = await supabase
      .from("user_activity_logs")
      .insert([
        {
          user_id: userId,
          event_type,
          ip,
          role: user.role,
          metadata,
          user_agent: userAgent,
        },
      ]);

    if (insertError) {
      console.error("insert log error", insertError);
      return NextResponse.json(
        { error: "Failed to insert log" },
        { status: 500 }
      );
    }

    await supabase
      .from("users")
      .update({ last_login: new Date().toISOString() })
      .eq("id", userId);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("record-login error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
