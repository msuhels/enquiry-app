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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthConfig } from "@/config/auth-config";
import type { AuthModuleConfig } from "@/types/auth-config.types";
import { authHandlers } from "@/lib/handlers/auth-module/user";

interface ForgotPasswordFormProps extends React.ComponentPropsWithoutRef<"div"> {
  config?: Partial<AuthModuleConfig>;
}

export function ForgotPasswordForm({
  className,
  config,
  ...props
}: ForgotPasswordFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const authConfig = useAuthConfig(config);
  const forgotPasswordConfig = authConfig.forgotPassword!;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Use OTP-based password reset
      const result = await authHandlers.sendPasswordResetOTP(email);

      if (result.success) {
        setSuccess(true);
        // Redirect to verify-otp page with email
        router.push(`/auth/verify-otp?email=${encodeURIComponent(email)}`);
      } else {
        setError(result.error || "Failed to send OTP. Please try again.");
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn(authConfig.globalStyles?.container || "flex flex-col gap-6", className)} {...props}>
      {success ? (
        <Card className={cn(authConfig.globalStyles?.card, forgotPasswordConfig.styles?.card)}>
          <CardHeader className={cn(authConfig.globalStyles?.cardHeader, forgotPasswordConfig.styles?.cardHeader)}>
            <CardTitle className={cn(authConfig.globalStyles?.title || "text-2xl", forgotPasswordConfig.styles?.title)}>
              OTP Sent!
            </CardTitle>
            <CardDescription className={cn(authConfig.globalStyles?.description, forgotPasswordConfig.styles?.description)}>
              We sent a 6-digit verification code to your email.
            </CardDescription>
          </CardHeader>
          <CardContent className={cn(authConfig.globalStyles?.cardContent, forgotPasswordConfig.styles?.cardContent)}>
            <p className={cn(authConfig.globalStyles?.helperText || "text-sm text-muted-foreground")}>
              Please check your email and enter the 6-digit code to reset your password.
            </p>
            <div className="mt-4">
              <Button
                onClick={() => router.push(`/auth/verify-otp?email=${encodeURIComponent(email)}`)}
                className={cn(authConfig.globalStyles?.button || "w-full")}
                style={{ backgroundColor: "#EE7B23" }}
              >
                Continue to Verify OTP
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className={cn(authConfig.globalStyles?.card, forgotPasswordConfig.styles?.card)}>
          <CardHeader className={cn(authConfig.globalStyles?.cardHeader, forgotPasswordConfig.styles?.cardHeader)}>
            {forgotPasswordConfig.title?.show && (
              <CardTitle className={cn(authConfig.globalStyles?.title || "text-2xl", forgotPasswordConfig.styles?.title)}>
                {forgotPasswordConfig.title?.text || "Reset Your Password"}
              </CardTitle>
            )}
            {forgotPasswordConfig.description?.show && (
              <CardDescription className={cn(authConfig.globalStyles?.description, forgotPasswordConfig.styles?.description)}>
                {forgotPasswordConfig.description?.text || "Type in your email and we'll send you a code to reset your password"}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className={cn(authConfig.globalStyles?.cardContent, forgotPasswordConfig.styles?.cardContent)}>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                {forgotPasswordConfig.email?.show && (
                  <div className="grid gap-2">
                    <Label
                      htmlFor="email"
                      className={cn(authConfig.globalStyles?.label, forgotPasswordConfig.email?.styles?.label)}
                    >
                      {forgotPasswordConfig.email?.label || "Email"}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={forgotPasswordConfig.email?.placeholder || "m@example.com"}
                      required={forgotPasswordConfig.email?.required}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError(null);
                      }}
                      className={cn(
                        authConfig.globalStyles?.input,
                        forgotPasswordConfig.email?.styles?.input,
                        error && "border-red-500 focus-visible:ring-red-500"
                      )}
                      disabled={isLoading}
                    />
                  </div>
                )}

                {forgotPasswordConfig.errorDisplay?.show && error && (
                  <p className={cn(authConfig.globalStyles?.errorMessage || "text-sm text-red-500", forgotPasswordConfig.errorDisplay?.styles?.errorMessage)}>
                    {error}
                  </p>
                )}

                {forgotPasswordConfig.submitButton?.show && (
                  <Button
                    type="submit"
                    className={cn(
                      authConfig.globalStyles?.button || "w-full",
                      forgotPasswordConfig.submitButton?.styles?.button
                    )}
                    disabled={isLoading || !email}
                    style={{ backgroundColor: "#EE7B23" }}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <LoadingSpinner size="sm" />
                        Sending OTP...
                      </div>
                    ) : (
                      forgotPasswordConfig.useOTP?.show
                        ? (forgotPasswordConfig.useOTP?.text?.buttonText || "Send OTP")
                        : (forgotPasswordConfig.submitButton?.text?.buttonText || "Send reset email")
                    )}
                  </Button>
                )}
              </div>

              {forgotPasswordConfig.loginLink?.show && (
                <div className="mt-4 text-center text-sm">
                  Already have an account?{" "}
                  <Link
                    href="/auth/login"
                    className={cn(
                      authConfig.globalStyles?.link,
                      forgotPasswordConfig.loginLink?.styles?.link
                    )}
                  >
                    {forgotPasswordConfig.loginLink?.text?.linkText?.split('? ')[1] || "Login"}
                  </Link>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
