// server/create-user.ts
"use server";
import { createServiceRoleClient } from "@/lib/supabase/adapters/service-role";
import { encryptPlaintext } from "@/lib/utils/encrytion/encryption";
import crypto from "crypto";
import type { UserProfile, UserServiceResult } from "./user.services";

export async function createUser({user, email}: {user: UserProfile, email: string}): Promise<UserServiceResult<{ user: UserProfile; password: string }>> {
  try {
    const supabaseAdmin = createServiceRoleClient();

    // 1️⃣ Generate a random password
    const generatedPassword = crypto.randomBytes(12).toString("base64").slice(0, 16);

    // 2️⃣ Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
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
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

// admin-user.services.ts
export async function getUser(identifier: string): Promise<UserServiceResult<UserProfile>> {
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
    return { success: false, error: error instanceof Error ? error.message : "Unexpected error" };
  }
}


export async function getUsers(): Promise<UserServiceResult<UserProfile[]>> {
  try {
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false }); // optional: order by creation date

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unexpected error" };
  }
}
