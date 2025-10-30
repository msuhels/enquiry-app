export interface NotificationInput {
  program_id?: string | null;
  title?: string | null;
  description?: string | null;
}

export async function getNotifications() {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function saveNotification(payload: NotificationInput) {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("notifications")
    .insert(payload)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/adapters/service-role";

export async function GET() {
  try {
    const supabase = await createServiceRoleClient();
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("GET notifications error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServiceRoleClient();
    const body = await req.json();

    const { data, error } = await supabase
      .from("notifications")
      .insert(body)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error("POST notifications error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
