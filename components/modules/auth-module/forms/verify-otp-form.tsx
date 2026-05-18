"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-bar";
import Link from "next/link";
import { usePasswordResetOTP } from "@/hooks/auth-modules";
import { useAuthConfig } from "@/config/auth-config";
import type { AuthModuleConfig } from "@/types/auth-config.types";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface VerifyOTPFormProps extends React.ComponentPropsWithoutRef<"div"> {
    config?: Partial<AuthModuleConfig>;
    email?: string;
}

export function VerifyOTPForm({
    className,
    config,
    email: initialEmail = "",
    ...props
}: VerifyOTPFormProps) {
    const {
        email,
        otp,
        newPassword,
        confirmPassword,
        isLoading,
        error,
        step,
        setEmail,
        setOtp,
        setNewPassword,
        setConfirmPassword,
        sendOTP,
        verifyOTPAndUpdatePassword,
        clearError,
    } = usePasswordResetOTP();

    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);
    const router = useRouter();

    const authConfig = useAuthConfig(config);

    // If email was passed as prop, use it
    useEffect(() => {
        if (initialEmail) {
            setEmail(initialEmail);
            // Automatically show password form when email is provided from query params
            setShowPasswordForm(true);
        }
        setIsInitializing(false);
    }, [initialEmail, setEmail]);

    const handleResendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        await sendOTP(email);
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await verifyOTPAndUpdatePassword(otp, newPassword);

        if (success) {
            router.push("/auth/login");
        }   
    };

    // Success state
    if (step === "success") {
        return (
            <div className={cn(authConfig.globalStyles?.container || "flex flex-col gap-6", className)} {...props}>
                <Card>
                    <CardHeader>
                        <CardTitle style={{ color: "#EE7B23" }}>Password Reset Complete!</CardTitle>
                        <CardDescription style={{ color: "#3A3886" }}>
                            Your password has been successfully updated.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/auth/login">
                            <Button className="w-full" style={{ backgroundColor: "#EE7B23" }}>
                                Go to Login
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Show loading while initializing
    if (isInitializing) {
        return (
            <div className={cn(authConfig.globalStyles?.container || "flex flex-col gap-6", className)} {...props}>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-center">
                            <LoadingSpinner size="lg" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // OTP Entry + Password Form
    if (showPasswordForm) {
        return (
            <div className={cn(authConfig.globalStyles?.container || "flex flex-col gap-6", className)} {...props}>
                <Card>
                    <CardHeader>
                        <CardTitle style={{ color: "#EE7B23" }}>Enter OTP & New Password</CardTitle>
                        <CardDescription style={{ color: "#3A3886" }}>
                            Enter the 6-digit code from your email and create a new password
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUpdatePassword}>
                            <div className="flex flex-col gap-6">
                                {initialEmail && (
                                    <div className="grid gap-2">
                                        <Label htmlFor="email" style={{ color: "#EE7B23" }}>
                                            Email
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={email}
                                            disabled
                                            style={{ color: "#3A3886", backgroundColor: "#f5f5f5" }}
                                        />
                                    </div>
                                )}

                                {!initialEmail && (
                                    <div className="grid gap-2">
                                        <Label htmlFor="email" style={{ color: "#EE7B23" }}>
                                            Email
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="m@example.com"
                                            required
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                clearError();
                                            }}
                                            style={{ color: "#3A3886" }}
                                            disabled={isLoading}
                                        />
                                    </div>
                                )}

                                <div className="grid gap-2">
                                    <Label htmlFor="otp" style={{ color: "#EE7B23" }}>
                                        OTP Code
                                    </Label>
                                    <Input
                                        id="otp"
                                        type="text"
                                        placeholder="Enter 6-digit OTP"
                                        required
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        maxLength={6}
                                        style={{ color: "#3A3886" }}
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="newPassword" style={{ color: "#EE7B23" }}>
                                        New Password
                                    </Label>
                                    <Input
                                        id="newPassword"
                                        type="password"
                                        placeholder="Enter new password"
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        style={{ color: "#3A3886" }}
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="confirmPassword" style={{ color: "#EE7B23" }}>
                                        Confirm Password
                                    </Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="Confirm new password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        style={{ color: "#3A3886" }}
                                        disabled={isLoading}
                                    />
                                    {confirmPassword && newPassword && confirmPassword !== newPassword && (
                                        <p className="text-sm text-red-500">Passwords do not match</p>
                                    )}
                                </div>

                                {error && (
                                    <p className="text-sm text-red-500">{error}</p>
                                )}

                                <Button
                                    type="submit"
                                    style={{ backgroundColor: "#EE7B23" }}
                                    disabled={isLoading || !otp || !newPassword || !confirmPassword}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <LoadingSpinner size="sm" />
                                            Updating...
                                        </div>
                                    ) : (
                                        "Update Password"
                                    )}
                                </Button>

                                {!initialEmail && (
                                    <button
                                        type="button"
                                        className="text-sm text-gray-500 hover:underline"
                                        onClick={() => {
                                            setShowPasswordForm(false);
                                            setOtp("");
                                        }}
                                    >
                                        ← Back to enter email
                                    </button>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <div className="text-center">
                    <button
                        type="button"
                        className="text-sm text-blue-600 hover:underline"
                        onClick={handleResendOTP}
                        disabled={isLoading || !email}
                    >
                        Resend OTP Code
                    </button>
                </div>

                <Link href="/auth/login" className="text-center text-sm text-gray-500">
                    Remember password? Login
                </Link>
            </div>
        );
    }

    // OTP Request Form (fallback when no email is provided)
    return (
        <div className={cn(authConfig.globalStyles?.container || "flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle style={{ color: "#EE7B23" }}>Reset Password with OTP</CardTitle>
                    <CardDescription style={{ color: "#3A3886" }}>
                        Enter your email to receive a 6-digit verification code
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleResendOTP}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email" style={{ color: "#EE7B23" }}>
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        clearError();
                                    }}
                                    style={{ color: "#3A3886" }}
                                    disabled={isLoading}
                                />
                            </div>

                            {error && (
                                <p className="text-sm text-red-500">{error}</p>
                            )}

                            <Button
                                type="submit"
                                style={{ backgroundColor: "#EE7B23" }}
                                disabled={isLoading || !email}
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <LoadingSpinner size="sm" />
                                        Sending...
                                    </div>
                                ) : (
                                    "Send OTP Code"
                                )}
                            </Button>

                            <Link href="/auth/login" className="text-center text-sm text-gray-500">
                                Remember password? Login
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
