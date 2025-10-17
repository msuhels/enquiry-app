"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useProfile } from "./useProfile";
import type { ProfileFormData } from "@/lib/schema/auth-module";

export interface UseProfileFormReturn {
  formData: ProfileFormData;
  fieldErrors: Record<string, string>;
  isLoading: boolean;
  error: string | null;
  updateField: (field: keyof ProfileFormData, value: string) => Promise<void>;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  clearError: () => void;
  clearFieldError: (field: keyof ProfileFormData) => void;
  loadProfile: () => Promise<void>;
}

export function useProfileForm(): UseProfileFormReturn {
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: "",
    lastName: "",
    phone: "",
    bio: "",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const { updateProfile, getProfile, isLoading, error, clearError } = useProfile();

  const updateField = useCallback(async (field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({
        ...prev,
        [field]: "",
      }));
    }

    // Real-time validation for the specific field
    try {
      const { profileSchema } = await import("@/lib/schema/auth-module");
      const fieldSchema = profileSchema.shape[field];

      if (fieldSchema) {
        fieldSchema.parse(value);
      }
    } catch (error: any) {
      if (error.errors && error.errors.length > 0) {
        setFieldErrors(prev => ({
          ...prev,
          [field]: error.errors[0].message,
        }));
      }
    }
  }, [fieldErrors]);

  const clearFieldError = useCallback((field: keyof ProfileFormData) => {
    setFieldErrors(prev => ({
      ...prev,
      [field]: "",
    }));
  }, []);

  const loadProfile = useCallback(async () => {
    const loadToast = toast.loading("Loading profile...");

    const profileData = await getProfile();
    if (profileData) {
      // Split full_name into firstName and lastName
      const fullName = profileData.full_name || "";
      const nameParts = fullName.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      setFormData({
        firstName,
        lastName,
        phone: profileData.phone_number || "",
        bio: profileData.bio || "",
      });

      toast.success("Profile loaded successfully!", { id: loadToast });
    } else {
      toast.dismiss(loadToast);
    }
  }, [getProfile]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous field errors
    setFieldErrors({});

    // Client-side validation using Zod
    const { profileSchema } = await import("@/lib/schema/auth-module");

    try {
      profileSchema.parse(formData);
    } catch (error: any) {
      if (error.errors) {
        const newFieldErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          if (err.path?.length > 0) {
            newFieldErrors[err.path[0]] = err.message;
          }
        });
        setFieldErrors(newFieldErrors);
        toast.error("Please fix the validation errors");
        return;
      }
    }

    const success = await updateProfile(formData);

    // If profile update failed due to validation errors, they will be handled by the handler
    // and reflected in the global error state
  }, [formData, updateProfile]);

  return {
    formData,
    fieldErrors,
    isLoading,
    error,
    updateField,
    handleSubmit,
    clearError,
    clearFieldError,
    loadProfile,
  };
} 