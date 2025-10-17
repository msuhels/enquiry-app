"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authHandlers } from "@/lib/handlers/auth-module/user";
import { useUserStore } from "@/lib/stores/auth-module";
import type { SignUpFormData } from "@/lib/schema/auth-module";

export interface UseSignUpReturn {
  // State from Zustand store
  isLoading: boolean;
  error: string | null;
  
  // Actions
  signUp: (credentials: SignUpFormData) => Promise<{ success: boolean; validationErrors?: Record<string, string> }>;
  clearError: () => void;
}

export function useSignUp(): UseSignUpReturn {
  const router = useRouter();
  
  // Get state and actions from Zustand store
  const {
    isLoading,
    error,
    clearError,
  } = useUserStore();

  const signUp = useCallback(async (credentials: SignUpFormData): Promise<{ success: boolean; validationErrors?: Record<string, string> }> => {
    const signUpToast = toast.loading("Creating your account...");
    
    try {
      const result = await authHandlers.signUp(credentials);
      
      if (result.success) {
        toast.success("Account created successfully! Please check your email for verification.", { id: signUpToast });
        // Small delay to show completion before redirect
        setTimeout(() => {
          router.push("/auth/sign-up-success");
        }, 500);
        return { success: true };
      } else {
        // Handle validation errors specifically
        if (result.validationErrors) {
          toast.error("Please fix the validation errors below.", { id: signUpToast });
          return { success: false, validationErrors: result.validationErrors };
        } else {
          toast.error(result.error || "Failed to create account. Please try again.", { id: signUpToast });
          return { success: false };
        }
      }
    } catch (error) {
      console.error("Sign up error:", error);
      toast.error("An unexpected error occurred during signup.", { id: signUpToast });
      return { success: false };
    }
  }, [router]);

  return {
    isLoading,
    error,
    signUp,
    clearError,
  };
} 