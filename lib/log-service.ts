'use server';
import { createServiceRoleClient } from "./supabase/adapters/service-role";

export async function logEvent(
  userId: string | null,
  eventType: "login" | "logout" | "enquiry" ,
  metadata: Record<string, any> = {},
  role: string | null = null,
  ip: string | null = null,
  email: string | null = null,
  location: Record<string, any> | null = null
) {
  try {
    const supabase =  createServiceRoleClient();

    await supabase.from("user_activity_logs").insert({
      user_id: userId,
      event_type: eventType,
      ip_address: ip,
      metadata: metadata,
      role: role,
    });

    console.log("✅ Activity logged:", eventType);
  } catch (error) {
    console.error("⚠️ Error logging event:", error);
  }
}
