import { createClient } from "@/lib/supabase/adapters/client";
import {
  loginSchema,
  signUpSchema,
  forgotPasswordSchema,
  updatePasswordSchema,
  profileSchema,
  type LoginFormData,
  type SignUpFormData,
  type ForgotPasswordFormData,
  type UpdatePasswordFormData,
  type ProfileFormData,
  type ValidationResult,
} from "@/lib/schema/auth-module";
import { useUserStore } from "@/lib/stores/auth-module";
import {
  getUserProfile,
  updateLastLogin,
  updateUserProfile,
} from "@/lib/supabase/auth-module/services/user.services";

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: any;
  validationErrors?: Record<string, string>;
}

export class AuthHandlers {
  private supabase;

  constructor() {
    this.supabase = createClient();
  }

  // Validate login form data
  validateLoginData(data: LoginFormData): ValidationResult<LoginFormData> {
    try {
      const validatedData = loginSchema.parse(data);
      return {
        success: true,
        data: validatedData,
      };
    } catch (error: any) {
      const errors: Record<string, string> = {};

      if (error.errors) {
        error.errors.forEach((err: any) => {
          if (err.path?.length > 0) {
            errors[err.path[0]] = err.message;
          }
        });
      }

      return {
        success: false,
        errors,
      };
    }
  }

  // Validate sign-up form data
  validateSignUpData(data: SignUpFormData): ValidationResult<SignUpFormData> {
    try {
      const validatedData = signUpSchema.parse(data);
      return {
        success: true,
        data: validatedData,
      };
    } catch (error: any) {
      const errors: Record<string, string> = {};

      if (error.errors) {
        error.errors.forEach((err: any) => {
          if (err.path?.length > 0) {
            errors[err.path[0]] = err.message;
          }
        });
      }

      return {
        success: false,
        errors,
      };
    }
  }

  // Validate forgot password form data
  validateForgotPasswordData(
    data: ForgotPasswordFormData
  ): ValidationResult<ForgotPasswordFormData> {
    try {
      const validatedData = forgotPasswordSchema.parse(data);
      return {
        success: true,
        data: validatedData,
      };
    } catch (error: any) {
      const errors: Record<string, string> = {};

      if (error.errors) {
        error.errors.forEach((err: any) => {
          if (err.path?.length > 0) {
            errors[err.path[0]] = err.message;
          }
        });
      }

      return {
        success: false,
        errors,
      };
    }
  }

  // Validate update password form data
  validateUpdatePasswordData(
    data: UpdatePasswordFormData
  ): ValidationResult<UpdatePasswordFormData> {
    try {
      const validatedData = updatePasswordSchema.parse(data);
      return {
        success: true,
        data: validatedData,
      };
    } catch (error: any) {
      const errors: Record<string, string> = {};

      if (error.errors) {
        error.errors.forEach((err: any) => {
          if (err.path?.length > 0) {
            errors[err.path[0]] = err.message;
          }
        });
      }

      return {
        success: false,
        errors,
      };
    }
  }

  // Validate profile form data
  validateProfileData(
    data: ProfileFormData
  ): ValidationResult<ProfileFormData> {
    try {
      const validatedData = profileSchema.parse(data);
      return {
        success: true,
        data: validatedData,
      };
    } catch (error: any) {
      const errors: Record<string, string> = {};

      if (error.errors) {
        error.errors.forEach((err: any) => {
          if (err.path?.length > 0) {
            errors[err.path[0]] = err.message;
          }
        });
      }

      return {
        success: false,
        errors,
      };
    }
  }

  async login(credentials: LoginFormData): Promise<AuthResult> {
    const { setLoginLoading, setError, setUser } = useUserStore.getState();

    // Validate input data
    const validation = this.validateLoginData(credentials);
    if (!validation.success) {
      return {
        success: false,
        validationErrors: validation.errors,
      };
    }

    setLoginLoading(true);
    setError(null);

    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        setError(error.message);
        return {
          success: false,
          error: error.message,
        };
      }

      if (data.user) {
        setUser(data.user);

        const accessToken = data.session?.access_token;

        try {
          const response = await fetch("/api/admin/record-login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              access_token: accessToken,
              event_type: "login",
            }),
          });

          if (!response.ok) {
            console.error("failed to call record-login", response);
          } else {
            const result = await response.json();
            console.log("LOGGING : record-login result:", result);
          }
        } catch (e) {
          console.error("failed to call record-login", e);
        }
      }

      // Update last login in users table
      if (data.user) {
        await updateLastLogin(data.user.id);
      }

      return {
        success: true,
        user: data.user,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoginLoading(false);
    }
  }

  async signUp(credentials: SignUpFormData): Promise<AuthResult> {
    const { setLoading, setError } = useUserStore.getState();

    // Validate input data
    const validation = this.validateSignUpData(credentials);
    if (!validation.success) {
      return {
        success: false,
        validationErrors: validation.errors,
      };
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await this.supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        setError(error.message);
        return {
          success: false,
          error: error.message,
        };
      }

      // Create user record in users table if auth user was created successfully
      if (data.user) {
        try {
          console.log("LOGGING : User found ", data.user);
          const response = await fetch("/api/admin/users", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              authUserId: data.user.id,
              email: credentials.email,
            }),
          });
          console.log("LOGGING : Response from API - status:", response.status);
          console.log(
            "LOGGING : Response from API - statusText:",
            response.statusText
          );
          console.log("LOGGING : Response from API - url:", response.url);

          if (!response.ok) {
            try {
              const errorData = await response.json();
              console.error("Failed to create user profile:", errorData.error);
            } catch (parseError) {
              const textResponse = await response.text();
              console.error(
                "Failed to create user profile - could not parse JSON:",
                textResponse
              );
            }
            // Note: We don't fail the signup if user profile creation fails
            // The user can still complete the auth flow
          } else {
            try {
              const responseData = await response.json();
              console.log(
                "LOGGING : User created successfully in users table:",
                responseData
              );
            } catch (parseError) {
              const textResponse = await response.text();
              console.error(
                "Success response but could not parse JSON:",
                textResponse
              );
            }
          }
        } catch (error) {
          console.error("Failed to create user profile:", error);
          // Note: We don't fail the signup if user profile creation fails
          // The user can still complete the auth flow
        }
      }

      return {
        success: true,
        user: data.user,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  }

  async forgotPassword(data: ForgotPasswordFormData): Promise<AuthResult> {
    const { setLoading, setError, setSuccess } = useUserStore.getState();

    // Validate input data
    const validation = this.validateForgotPasswordData(data);
    if (!validation.success) {
      return {
        success: false,
        validationErrors: validation.errors,
      };
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(
        data.email,
        {
          redirectTo: `${window.location.origin}/auth/update-password`,
        }
      );

      if (error) {
        setError(error.message);
        return {
          success: false,
          error: error.message,
        };
      }

      setSuccess(true);
      return {
        success: true,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  }

  async updatePassword(data: UpdatePasswordFormData): Promise<AuthResult> {
    const { setLoading, setError } = useUserStore.getState();

    // Validate input data
    const validation = this.validateUpdatePasswordData(data);
    if (!validation.success) {
      return {
        success: false,
        validationErrors: validation.errors,
      };
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await this.supabase.auth.updateUser({
        password: data.password,
      });

      if (error) {
        setError(error.message);
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  }

  async updateProfile(data: ProfileFormData): Promise<AuthResult> {
    const { setLoading, setError } = useUserStore.getState();

    // Validate input data
    const validation = this.validateProfileData(data);
    if (!validation.success) {
      return {
        success: false,
        validationErrors: validation.errors,
      };
    }

    setLoading(true);
    setError(null);

    try {
      // Get current user
      const {
        data: { user },
        error: authError,
      } = await this.supabase.auth.getUser();

      if (authError || !user) {
        setError("User not authenticated");
        return {
          success: false,
          error: "User not authenticated",
        };
      }

      // Update user profile in users table
      const result = await updateUserProfile(user.id, data);

      if (!result.success) {
        setError(result.error || "Failed to update profile");
        return {
          success: false,
          error: result.error || "Failed to update profile",
        };
      }

      return {
        success: true,
        user: result.data,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  }

  async getProfile(): Promise<AuthResult> {
    const { setLoading, setError } = useUserStore.getState();

    setLoading(true);
    setError(null);

    try {
      // Get current auth user
      const {
        data: { user },
        error: authError,
      } = await this.supabase.auth.getUser();

      if (authError || !user) {
        setError("User not authenticated");
        return {
          success: false,
          error: "User not authenticated",
        };
      }

      // Get user profile from users table
      const result = await getUserProfile(user.id);

      if (!result.success) {
        setError(result.error || "Failed to get profile");
        return {
          success: false,
          error: result.error || "Failed to get profile",
        };
      }

      return {
        success: true,
        user: result.data,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  }

  async logout(): Promise<AuthResult> {
    const {
      setLogoutLoading,
      setError,
      logout: storeLogout,
      user,
    } = useUserStore.getState();

    setLogoutLoading(true);
    setError(null);

    try {
      const session = await this.supabase.auth.getSession();
      const accessToken = session.data.session?.access_token;

      if (accessToken) {
        try {
          const response = await fetch("/api/admin/record-login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              access_token: accessToken,
              event_type: "logout",
            }),
          });

          if (!response.ok) {
            console.error("failed to call record-login", response);
          } else {
            const result = await response.json();
            console.log("LOGGING : record-login result:", result);
          }
        } catch (e) {
          console.error("failed to call record-login", e);
        }
      }

      const { error } = await this.supabase.auth.signOut();

      if (error) {
        setError(error.message);
        return {
          success: false,
          error: error.message,
        };
      }

      storeLogout();

      return {
        success: true,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLogoutLoading(false);
    }
  }

  async getCurrentUser() {
    const { setLoading, setError, setUser } = useUserStore.getState();

    setLoading(true);
    setError(null);

    try {
      const {
        data: { user },
        error,
      } = await this.supabase.auth.getUser();

      if (error) {
        setError(error.message);
        return {
          success: false,
          error: error.message,
        };
      }

      setUser(user);

      return {
        success: true,
        user,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  }

  // Listen to auth state changes
  onAuthStateChange(callback: (user: any) => void) {
    return this.supabase.auth.onAuthStateChange((event, session) => {
      const { setUser } = useUserStore.getState();
      const user = session?.user ?? null;

      setUser(user);
      callback(user);
    });
  }
}

// Export a singleton instance
export const authHandlers = new AuthHandlers();
