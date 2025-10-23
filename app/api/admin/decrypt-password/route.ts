// app/api/admin/decrypt-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/adapters/service-role";
import { createClient } from "@/lib/supabase/adapters/server"; // Cookie-based client
import { decryptToPlaintext } from "@/lib/utils/encrytion/encryption";

export async function POST(req: NextRequest) {
  try {
    // Get the authenticated user from cookies (Next.js automatically sends cookies)
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const callerUserId = user.id;

    // Verify the caller is admin using service role client
    const supabaseAdmin = createServiceRoleClient();
    const { data: callerRow, error: rowErr } = await supabaseAdmin
      .from("users")
      .select("role")
      .eq("id", callerUserId)
      .single();

    if (rowErr || !callerRow || callerRow.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Parse request body: { authUserId: string }
    const body = await req.json();
    const { authUserId } = body;
    if (!authUserId) {
      return NextResponse.json({ error: "authUserId required" }, { status: 400 });
    }

    // Read encrypted fields
    const { data, error } = await supabaseAdmin
      .from("users")
      .select("password, password_iv, password_tag, password_algo")
      .eq("id", authUserId)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Decrypt
    try {
      const plaintext = decryptToPlaintext({
        ciphertext: data.password,
        iv: data.password_iv,
        tag: data.password_tag,
      });

      // Audit log
      await supabaseAdmin.from("admin_audit_logs").insert([
        {
          admin_id: callerUserId,
          target_user_id: authUserId,
          action: "decrypted_password",
          created_at: new Date().toISOString(),
          meta: {},
        },
      ]);

      return NextResponse.json({ password: plaintext }, { status: 200 });
    } catch (decErr) {
      console.error("decryption failed", decErr);
      return NextResponse.json({ error: "Decryption error" }, { status: 500 });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}