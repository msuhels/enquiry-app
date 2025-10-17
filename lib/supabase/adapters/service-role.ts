import { createClient } from "@supabase/supabase-js";

/**
 * Service role client for server-side operations that bypass RLS.
 * This should only be used in server-side contexts where you need
 * elevated permissions to perform administrative operations.
 * 
 * IMPORTANT: Never expose this client to the frontend!
 */
export function createServiceRoleClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing required Supabase environment variables for service role client");
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}