"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import type { ForgotPasswordFormData } from "@/lib/schema/auth-module";
import { useForgotPassword } from "./useForgotPassword";

export interface UseForgotPasswordFormReturn {
    formData: ForgotPasswordFormData;
    fieldErrors: Record<string, string>;
    isLoading: boolean;
    error: string | null;
    success: boolean;
    updateField: (field: keyof ForgotPasswordFormData, value: string) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    clearError: () => void;
    clearFieldError: (field: keyof ForgotPasswordFormData) => void;
}

export function useForgotPasswordForm(): UseForgotPasswordFormReturn {
    const [formData, setFormData] = useState<ForgotPasswordFormData>({
        email: "",
    });

    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const { forgotPassword, isLoading, error, success, clearError } = useForgotPassword();

    const updateField = useCallback((field: keyof ForgotPasswordFormData, value: string) => {
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

    const clearFieldError = useCallback((field: keyof ForgotPasswordFormData) => {
        setFieldErrors(prev => ({
            ...prev,
            [field]: "",
        }));
    }, []);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        // Clear previous field errors
        setFieldErrors({});

        if (!formData.email) {
            toast.error("Please enter your email address");
            return;
        }

        const success = await forgotPassword(formData);

        // If forgot password failed due to validation errors, they will be handled by the auth handler
        // and reflected in the global error state
    }, [formData, forgotPassword]);

    return {
        formData,
        fieldErrors,
        isLoading,
        error,
        success,
        updateField,
        handleSubmit,
        clearError,
        clearFieldError,
    };
} 