// server/create-user.ts
"use server";
import { createServiceRoleClient } from "@/lib/supabase/adapters/service-role";
import { encryptPlaintext } from "@/lib/utils/encrytion/encryption";
import crypto from "crypto";
import type { UserProfile, UserServiceResult } from "./user.services";

export async function createUser({
  user,
  email,
}: {
  user: UserProfile;
  email: string;
}): Promise<UserServiceResult<{ user: UserProfile; password: string }>> {
  try {
    const supabaseAdmin = createServiceRoleClient();

    // 1️⃣ Generate a random password
    const generatedPassword = crypto
      .randomBytes(12)
      .toString("base64")
      .slice(0, 16);

    // 2️⃣ Create the user in Supabase Auth
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password: generatedPassword,
        email_confirm: true,
      });

    if (authError) {
      console.error("Supabase Auth creation failed:", authError);
      return { success: false, error: authError.message };
    }

    // 3️⃣ Encrypt the password for storage in your custom table
    const enc = encryptPlaintext(generatedPassword);

    // 4️⃣ Insert user record into custom 'users' table
    const userRecord = {
      id: authData.user.id, // Use Supabase Auth user id
      email: email,
      full_name: user.full_name,
      phone_number: user.phone_number,
      email_verified: authData.user.email_confirmed_at ? true : false,
      password: enc.ciphertext,
      password_iv: enc.iv,
      password_tag: enc.tag,
      password_algo: enc.algo,
      role: "user",
      status: "active",
      is_active: user.is_active,
      organization: user.organization,
      state: user.state,
      city: user.city,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: tableData, error: tableError } = await supabaseAdmin
      .from("users")
      .insert([userRecord])
      .select()
      .single();

    if (tableError) {
      console.error("Custom user table insertion failed:", tableError);
      return { success: false, error: tableError.message };
    }

    // 5️⃣ Return both the user data and plaintext password for admin display
    return {
      success: true,
      data: {
        user: tableData,
        password: generatedPassword,
      },
    };
  } catch (error) {
    console.error("Unexpected error in createUser:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

// admin-user.services.ts
export async function getUser(
  identifier: string
): Promise<UserServiceResult<UserProfile>> {
  try {
    const supabase = createServiceRoleClient();

    // Fetch from your custom table
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .or(`id.eq.${identifier},email.eq.${identifier}`)
      .single();

    if (error) {
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

interface GetUsersParams {
  search?: string;
  filter?: string;
  sortKey?: string;
  sortDir?: "asc" | "desc";
  limit?: number;
  offset?: number;
  name?: string;
  organization?: string;
}

interface GetUsersResult extends UserServiceResult<UserProfile[]> {
  total?: number;
}

export async function getUsers(
  params?: GetUsersParams
): Promise<GetUsersResult> {
  try {
    const supabase = createServiceRoleClient();

    // Default values
    const {
      search,
      filter,
      sortKey = "created_at",
      sortDir = "desc",
      limit = 10,
      offset = 0,
      name,
      organization
    } = params || {};

    console.log("LOGGING : getUsers service called with params:", params);

    // Build query with count
    let query = supabase
      .from("users")
      .select("*", { count: "exact" })
      .order(sortKey, { ascending: sortDir === "asc" });

    if(name){
      query = query.ilike("full_name", `%${name}%`);
    }

    if(organization){
      query = query.ilike("organization", `%${organization}%`);
    }

    // Apply additional filter if needed
    if (filter) {
      // Example: filter by role or status
      // Adjust based on your filter requirements
      if (filter !== "all") {
        query = query.eq("role", filter);
        // or query = query.eq("status", filter);
      }
    }

    // Apply pagination
    const from = offset;
    const to = offset + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error("LOGGING : Error fetching users:", error);
      return { success: false, error: error.message };
    }

    console.log(
      "LOGGING : Users fetched successfully:",
      `${data?.length} users out of ${count} total`
    );

    return {
      success: true,
      data: data || [],
      total: count || 0,
    };
  } catch (error) {
    console.error("LOGGING : Unexpected error in getUsers:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unexpected error",
    };
  }
}

export async function updateUser(id: string, updates: any) {
  try {
    const supabaseAdmin = createServiceRoleClient();
    const { data, error } = await supabaseAdmin
      .from("users")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    console.error("Supabase updateUser error:", error.message);
    return { success: false, error: error.message };
  }
}

export async function toggleUserStatus(
  userId: string,
  newStatus: "active" | "inactive"
): Promise<UserServiceResult<UserProfile>> {
  try {
    const supabase = createServiceRoleClient();

    // 1️⃣ Update the user's status in the custom table
    const { data, error } = await supabase
      .from("users")
      .update({ is_active: newStatus, updated_at: new Date().toISOString() })
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      console.error("Supabase user status update failed:", error);
      return { success: false, error: error.message };
    }

    const authStatus = newStatus === "inactive";
    const { error: authError } = await supabase.auth.admin.updateUserById(
      userId,
      {
        banned_until: authStatus ? "2999-12-31T23:59:59Z" : null,
      }
    );

    if (authError) {
      console.error("Supabase Auth status update failed:", authError);
      return { success: false, error: authError.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Unexpected error in toggleUserStatus:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unexpected error",
    };
  }
}
