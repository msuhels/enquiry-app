import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/adapters/service-role";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createServiceRoleClient();

  const { id } = await params;

  if (!id) return NextResponse.json({ error: "Notification ID is required" });

  const { error } = await supabase
    .from("notifications")
    .update({ is_readed: true })
    .eq("id", id);

  if (error) return NextResponse.json({ error });

  return NextResponse.json({ success: true });
}
