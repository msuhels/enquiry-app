"use client";

import { useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { useUpdatePassword } from "./useUpdatePassword";
import { validatePasswordStrength, type PasswordStrengthResult } from "@/lib/utils";
import type { UpdatePasswordFormData } from "@/lib/schema/auth-module";

export interface UseUpdatePasswordFormReturn {
  formData: UpdatePasswordFormData;
  fieldErrors: Record<string, string>;
  isLoading: boolean;
  error: string | null;
  passwordStrength: PasswordStrengthResult;
  updateField: (field: keyof UpdatePasswordFormData, value: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  clearError: () => void;
  clearFieldError: (field: keyof UpdatePasswordFormData) => void;
}

export function useUpdatePasswordForm(): UseUpdatePasswordFormReturn {
  const [formData, setFormData] = useState<UpdatePasswordFormData>({
    password: "",
    confirmPassword: "",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const { updatePassword, isLoading, error, clearError } = useUpdatePassword();

  // Calculate password strength
  const passwordStrength = useMemo(() => {
    return validatePasswordStrength(formData.password);
  }, [formData.password]);

  const updateField = useCallback((field: keyof UpdatePasswordFormData, value: string) => {
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
  }, [fieldErrors]);

  const clearFieldError = useCallback((field: keyof UpdatePasswordFormData) => {
    setFieldErrors(prev => ({
      ...prev,
      [field]: "",
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous field errors
    setFieldErrors({});

    if (!formData.password || !formData.confirmPassword) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setFieldErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    const result = await updatePassword(formData);
    
    // Handle validation errors from server
    if (!result.success && result.validationErrors) {
      setFieldErrors(result.validationErrors);
    }
  }, [formData, updatePassword]);

  return {
    formData,
    fieldErrors,
    isLoading,
    error,
    passwordStrength,
    updateField,
    handleSubmit,
    clearError,
    clearFieldError,
  };
} 