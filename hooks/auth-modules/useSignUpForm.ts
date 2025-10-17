"use client";

import { useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { useSignUp } from "./useSignUp";
import { validatePasswordStrength, type PasswordStrengthResult } from "@/lib/utils";
import type { SignUpFormData } from "@/lib/schema/auth-module";

export interface UseSignUpFormReturn {
  formData: SignUpFormData;
  fieldErrors: Record<string, string>;
  isLoading: boolean;
  error: string | null;
  passwordStrength: PasswordStrengthResult;
  updateField: (field: keyof SignUpFormData, value: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  clearError: () => void;
  clearFieldError: (field: keyof SignUpFormData) => void;
}

export function useSignUpForm(): UseSignUpFormReturn {
  const [formData, setFormData] = useState<SignUpFormData>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const { signUp, isLoading, error, clearError } = useSignUp();

  // Calculate password strength
  const passwordStrength = useMemo(() => {
    return validatePasswordStrength(formData.password);
  }, [formData.password]);

  const updateField = useCallback((field: keyof SignUpFormData, value: string) => {
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

  const clearFieldError = useCallback((field: keyof SignUpFormData) => {
    setFieldErrors(prev => ({
      ...prev,
      [field]: "",
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous field errors
    setFieldErrors({});
    
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setFieldErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    const result = await signUp(formData);
    
    // Handle validation errors from server
    if (!result.success && result.validationErrors) {
      setFieldErrors(result.validationErrors);
    }
  }, [formData, signUp]);

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