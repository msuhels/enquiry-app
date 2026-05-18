"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authHandlers } from "@/lib/handlers/auth-module/user";
import { useUserStore } from "@/lib/stores/auth-module";

export interface UsePasswordResetOTPReturn {
    // State
    email: string;
    otp: string;
    newPassword: string;
    confirmPassword: string;
    isLoading: boolean;
    error: string | null;
    success: boolean;
    step: "email" | "otp" | "success";

    // Actions
    setEmail: (email: string) => void;
    setOtp: (otp: string) => void;
    setNewPassword: (password: string) => void;
    setConfirmPassword: (password: string) => void;
    sendOTP: (email: string) => Promise<boolean>;
    verifyOTPAndUpdatePassword: (otp: string, newPassword: string) => Promise<boolean>;
    clearError: () => void;
}

export function usePasswordResetOTP(): UsePasswordResetOTPReturn {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [step, setStep] = useState<"email" | "otp" | "success">("email");

    const store = useUserStore();
    const isLoading = store.isLoading;
    const error = store.error;
    const success = store.success;

    const sendOTP = useCallback(async (email: string): Promise<boolean> => {
        console.log("📱 [usePasswordResetOTP] Sending OTP to:", email);

        const result = await authHandlers.sendPasswordResetOTP(email);

        if (result.success) {
            setEmail(email);
            setStep("otp");
            toast.success("OTP sent! Check your email for the 6-digit code.");
            return true;
        } else {
            toast.error(result.error || "Failed to send OTP");
            return false;
        }
    }, []);

    const verifyOTPAndUpdatePassword = useCallback(async (otp: string, newPassword: string): Promise<boolean> => {
        console.log("🔐 [usePasswordResetOTP] Verifying OTP and updating password...");

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return false;
        }

        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return false;
        }

        const result = await authHandlers.verifyPasswordResetOTP(email, otp, newPassword);

        if (result.success) {
            setStep("success");
            toast.success("Password updated successfully!");
            return true;
        } else {
            toast.error(result.error || "Failed to verify OTP and update password");
            return false;
        }
    }, [email, confirmPassword]);

    const clearError = useCallback(() => {
        useUserStore.getState().clearError();
    }, []);

    return {
        email,
        otp,
        newPassword,
        confirmPassword,
        isLoading,
        error,
        success,
        step,
        setEmail,
        setOtp,
        setNewPassword,
        setConfirmPassword,
        sendOTP,
        verifyOTPAndUpdatePassword,
        clearError,
    };
}
