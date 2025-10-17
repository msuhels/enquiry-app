"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authHandlers } from "@/lib/handlers/auth-module/user";
import { useUserStore } from "@/lib/stores/auth-module";
import type { UpdatePasswordFormData } from "@/lib/schema/auth-module";

export interface UseUpdatePasswordReturn {
  // State from Zustand store
  isLoading: boolean;
  error: string | null;

  // Actions
  updatePassword: (data: UpdatePasswordFormData) => Promise<{ success: boolean; validationErrors?: Record<string, string> }>;
  clearError: () => void;
}

export function useUpdatePassword(): UseUpdatePasswordReturn {
  const router = useRouter();

  // Get state and actions from Zustand store
  const {
    isLoading,
    error,
    clearError,
  } = useUserStore();

  const updatePassword = useCallback(async (data: UpdatePasswordFormData): Promise<{ success: boolean; validationErrors?: Record<string, string> }> => {
    const updateToast = toast.loading("Updating your password...");

    try {
      const result = await authHandlers.updatePassword(data);

      if (result.success) {
        toast.success("Password updated successfully! Redirecting...", { id: updateToast });
        // Small delay to show completion before redirect
        setTimeout(() => {
          router.push("/dashboard");
        }, 500);
        return { success: true };
      } else {
        // Handle validation errors specifically
        if (result.validationErrors) {
          toast.error("Please fix the validation errors below.", { id: updateToast });
          return { success: false, validationErrors: result.validationErrors };
        } else {
          toast.error(result.error || "Failed to update password. Please try again.", { id: updateToast });
          return { success: false };
        }
      }
    } catch (error) {
      console.error("Update password error:", error);
      toast.error("An unexpected error occurred while updating password.", { id: updateToast });
      return { success: false };
    }
  }, [router]);

  return {
    isLoading,
    error,
    updatePassword,
    clearError,
  };
} 