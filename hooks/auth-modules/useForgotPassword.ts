"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { authHandlers } from "@/lib/handlers/auth-module/user";
import { useUserStore } from "@/lib/stores/auth-module";
import type { ForgotPasswordFormData } from "@/lib/schema/auth-module";

export interface UseForgotPasswordReturn {
  // State from Zustand store
  isLoading: boolean;
  error: string | null;
  success: boolean;
  
  // Actions
  forgotPassword: (data: ForgotPasswordFormData) => Promise<boolean>;
  clearError: () => void;
}

export function useForgotPassword(): UseForgotPasswordReturn {
  // Get state and actions from Zustand store
  const {
    isLoading,
    error,
    success,
    clearError,
  } = useUserStore();

  const forgotPassword = useCallback(async (data: ForgotPasswordFormData): Promise<boolean> => {
    const resetToast = toast.loading("Sending password reset email...");
    
    try {
      const result = await authHandlers.forgotPassword(data);
      
      if (result.success) {
        toast.success("Password reset email sent! Please check your inbox.", { id: resetToast });
        return true;
      } else {
        toast.error("Failed to send reset email. Please try again.", { id: resetToast });
        return false;
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error("An unexpected error occurred. Please try again.", { id: resetToast });
      return false;
    }
  }, []);

  return {
    isLoading,
    error,
    success,
    forgotPassword,
    clearError,
  };
} 