"use server";

import { createClient } from "@/lib/supabase/adapters/server";
import { createServiceRoleClient } from "@/lib/supabase/adapters/service-role";
import type { ProfileFormData } from "@/lib/schema/auth-module";

export interface UserProfile {
  id: string;
  created_at: string;
  role: string;
  email: string;
  updated_at: string;
  full_name: string | null;
  organization: string;
  state: string;
  city: string;
  is_active: boolean;
  profile_picture_url: string | null;
  status: string;
  email_verified: boolean;
  phone_number: string | null;
  oauth_provider: string | null;
  oauth_id: string | null;
  bio: string | null;
  timezone: string | null;
  last_login_ip: string | null;
  last_login_at: string | null;
}

export interface UserServiceResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  tempPassword?: string;
}

export async function createUser(
  authUserId: string,
  email: string
): Promise<UserServiceResult<UserProfile>> {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          id: authUserId,
          email,
          email_verified: false,
          role: "user",
          status: "active",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating user:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unexpected error",
    };
  }
}

export async function getUserProfile(
  userId: string
): Promise<UserServiceResult<UserProfile>> {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) return { success: false, error: error.message };

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unexpected error",
    };
  }
}

export async function updateUserProfile(
  userId: string,
  profileData: ProfileFormData
): Promise<UserServiceResult<UserProfile>> {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("users")
      .update({
        full_name: `${profileData.firstName} ${profileData.lastName}`.trim(),
        phone_number: profileData.phone || null,
        bio: profileData.bio || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) return { success: false, error: error.message };

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unexpected error",
    };
  }
}

export async function updateLastLogin(
  userId: string,
  ip?: string
): Promise<UserServiceResult> {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("users")
      .update({
        last_login_at: new Date().toISOString(),
        last_login_ip: ip || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unexpected error",
    };
  }
}

export async function updateEmailVerification(
  userId: string,
  verified: boolean
): Promise<UserServiceResult> {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("users")
      .update({
        email_verified: verified,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unexpected error",
    };
  }
}

export async function deleteUser(userId: string): Promise<UserServiceResult> {
  const adminSupabase = createServiceRoleClient();

  try {
    const { error } = await adminSupabase
      .from("users")
      .delete()
      .eq("id", userId);

    if (error) return { success: false, error: error.message };

    const { error: authError } = await adminSupabase.auth.admin.deleteUser(
      userId
    );

    if (authError) return { success: false, error: authError.message };

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unexpected error",
    };
  }
}
