"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useAuth } from "./useAuth";
import type { LoginFormData } from "@/lib/schema/auth-module";

export interface UseLoginFormReturn {
  formData: LoginFormData;
  fieldErrors: Record<string, string>;
  isLoginLoading: boolean;
  error: string | null;
  updateField: (field: keyof LoginFormData, value: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  clearError: () => void;
  clearFieldError: (field: keyof LoginFormData) => void;
}

export function useLoginForm(): UseLoginFormReturn {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const { login, isLoginLoading, error, clearError } = useAuth();

  const updateField = useCallback((field: keyof LoginFormData, value: string) => {
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

  const clearFieldError = useCallback((field: keyof LoginFormData) => {
    setFieldErrors(prev => ({
      ...prev,
      [field]: "",
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous field errors
    setFieldErrors({});
    
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    const success = await login(formData);

    
    // If login failed due to validation errors, they will be handled by the auth handler
    // and reflected in the global error state
  }, [formData, login]);

  return {
    formData,
    fieldErrors,
    isLoginLoading,
    error,
    updateField,
    handleSubmit,
    clearError,
    clearFieldError,
  };
} 