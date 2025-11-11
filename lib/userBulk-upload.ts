import { createServiceRoleClient } from "./supabase/adapters/service-role";
import { BulkUserInput, BulkUserUploadResult } from "./types";
import { encryptPlaintext } from "./utils/encrytion/encryption";
import crypto from "crypto";

export async function bulkCreateUsersWithValidation(
  users: BulkUserInput[]
): Promise<BulkUserUploadResult> {
  const supabaseAdmin = createServiceRoleClient();
  const results: BulkUserUploadResult = {
    success: true,
    total: users.length,
    successful: 0,
    failed: 0,
    errors: [],
    data: [],
  };

  try {
    for (let i = 0; i < users.length; i++) {
      const userInput = users[i];
      // console.log("LOGGING : Processing user:", JSON.stringify(userInput));
      try {
        // Validate required fields
        if (!userInput.email) {
          results.failed++;
          results.errors.push({
            row: i + 1,
            user: userInput,
            error: "Email is required",
          });
          continue;
        }

        // if (!userInput.full_name) {
        //   results.failed++;
        //   results.errors.push({
        //     row: i + 1,
        //     user: userInput,
        //     error: "Full name is required",
        //   });
        //   continue;
        // }

        // 1️⃣ Generate a random password
        const generatedPassword = crypto
          .randomBytes(12)
          .toString("base64")
          .slice(0, 16);

        // 2️⃣ Create the user in Supabase Auth
        const { data: authData, error: authError } =
          await supabaseAdmin.auth.admin.createUser({
            email: userInput.email,
            password: generatedPassword,
            email_confirm: true,
          });

        if (authError) {
          results.failed++;
          results.errors.push({
            row: i + 1,
            user: userInput,
            error: `Auth creation failed: ${authError.message}`,
          });
          continue;
        }

        // 3️⃣ Encrypt the password for storage
        const enc = encryptPlaintext(generatedPassword);

        // 4️⃣ Insert user record into custom 'users' table
        const userRecord = {
          id: authData.user.id,
          email: userInput.email,
          full_name: userInput.full_name,
          phone_number: userInput.phone_number || null,
          email_verified: authData.user.email_confirmed_at ? true : false,
          password: enc.ciphertext,
          password_iv: enc.iv,
          password_tag: enc.tag,
          password_algo: enc.algo,
          role: "user",
          organization: userInput.organization,
          state: userInput.state,
          city: userInput.city,
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
          // If table insertion fails, try to delete the auth user
          await supabaseAdmin.auth.admin.deleteUser(authData.user.id);

          results.failed++;
          results.errors.push({
            row: i + 1,
            user: userInput,
            error: `Table insertion failed: ${tableError.message}`,
          });
          continue;
        }

        // Success!
        results.successful++;
        results.data?.push({
          user: tableData,
          password: generatedPassword,
        });

        // console.log(
        //   `User ${i + 1}/${users.length} created: ${userInput.email}`
        // );
      } catch (error) {
        results.failed++;
        results.errors.push({
          row: i + 1,
          user: userInput,
          error: error instanceof Error ? error.message : "Unexpected error",
        });
      }
    }

    results.success = results.failed === 0;
    return results;
  } catch (error) {
    console.error("Bulk user creation error:", error);
    return {
      success: false,
      total: users.length,
      successful: results.successful,
      failed: users.length - results.successful,
      errors: [
        {
          row: 0,
          user: {} as BulkUserInput,
          error:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
        },
      ],
    };
  }
}
