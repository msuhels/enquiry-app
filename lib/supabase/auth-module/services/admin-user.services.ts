"use server"
import { createServiceRoleClient } from "@/lib/supabase/adapters/service-role";
import type { UserProfile, UserServiceResult } from "./user.services";

/**
 * Admin User Service - Uses service role to bypass RLS
 * This should only be used in server-side contexts for administrative operations
 */

/**
 * Create a new user in the users table using service role (bypasses RLS)
 * This is called during the signup process after auth user is created
 */
export async function createUser(authUserId: string, email: string): Promise<UserServiceResult<UserProfile>> {
  try {
    const supabase = createServiceRoleClient();

    const userRecord = {
      id: authUserId,
      email: email,
      email_verified: false,
      role: 'user',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };


    const { data, error } = await supabase
      .from('users')
      .insert([userRecord])
      .select()
      .single();


    if (error) {
      console.error("Admin user creation error:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error("Admin user creation unexpected error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}

/**
 * Update user email verification status using service role
 */
export async function updateEmailVerification(userId: string, verified: boolean): Promise<UserServiceResult> {
  try {
    const supabase = createServiceRoleClient();
    const { error } = await supabase
      .from('users')
      .update({
        email_verified: verified,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      console.error("Admin email verification update error:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Admin email verification update unexpected error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}

/**
 * Update user role using service role (administrative operation)
 */
export async function updateUserRole(userId: string, role: string): Promise<UserServiceResult> {
  try {
    const supabase = createServiceRoleClient();
    const { error } = await supabase
      .from('users')
      .update({
        role: role,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      console.error("Admin role update error:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Admin role update unexpected error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}