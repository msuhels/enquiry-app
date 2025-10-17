"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { authHandlers } from "@/lib/handlers/auth-module/user";
import { useUserStore } from "@/lib/stores/auth-module";
import type { ProfileFormData } from "@/lib/schema/auth-module";

export interface UseProfileReturn {
  // State from Zustand store
  isLoading: boolean;
  error: string | null;

  // Actions
  updateProfile: (data: ProfileFormData) => Promise<boolean>;
  getProfile: () => Promise<any>;
  clearError: () => void;
}

export function useProfile(): UseProfileReturn {
  // Get state and actions from Zustand store
  const {
    isLoading,
    error,
    clearError,
  } = useUserStore();

  const updateProfile = useCallback(async (data: ProfileFormData): Promise<boolean> => {
    const updateToast = toast.loading("Updating your profile...");

    try {
      const result = await authHandlers.updateProfile(data);

      if (result.success) {
        toast.success("Profile updated successfully!", { id: updateToast });
        return true;
      } else {
        toast.error("Failed to update profile. Please try again.", { id: updateToast });
        return false;
      }
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error("An unexpected error occurred while updating profile.", { id: updateToast });
      return false;
    }
  }, []);

  const getProfile = useCallback(async () => {
    try {
      const result = await authHandlers.getProfile();
      return result.success ? result.user : null;
    } catch (error) {
      console.error("Get profile error:", error);
      toast.error("Failed to load profile data.");
      return null;
    }
  }, []);

  return {
    isLoading,
    error,
    updateProfile,
    getProfile,
    clearError,
  };
} 