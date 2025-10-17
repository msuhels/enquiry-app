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
import Link from "next/link";
import { useForgotPasswordForm } from "@/hooks/auth-modules";
import { useAuthConfig } from "@/config/auth-config";
import type { AuthModuleConfig } from "@/types/auth-config.types";

interface ForgotPasswordFormProps extends React.ComponentPropsWithoutRef<"div"> {
  config?: Partial<AuthModuleConfig>;
}

export function ForgotPasswordForm({
  className,
  config,
  ...props
}: ForgotPasswordFormProps) {
  const {
    formData,
    fieldErrors,
    isLoading,
    error,
    success,
    updateField,
    handleSubmit,
    clearError,
    clearFieldError,
  } = useForgotPasswordForm();

  const authConfig = useAuthConfig(config);
  const forgotPasswordConfig = authConfig.forgotPassword!;

  return (
    <div className={cn(authConfig.globalStyles?.container || "flex flex-col gap-6", className)} {...props}>
      {success && forgotPasswordConfig.successDisplay?.show ? (
        <Card className={cn(authConfig.globalStyles?.card, forgotPasswordConfig.styles?.card)}>
          <CardHeader className={cn(authConfig.globalStyles?.cardHeader, forgotPasswordConfig.styles?.cardHeader)}>
            <CardTitle className={cn(authConfig.globalStyles?.title || "text-2xl", forgotPasswordConfig.styles?.title)}>
              {forgotPasswordConfig.successDisplay?.text?.title || "Check Your Email"}
            </CardTitle>
            <CardDescription className={cn(authConfig.globalStyles?.description, forgotPasswordConfig.styles?.description)}>
              {forgotPasswordConfig.successDisplay?.text?.description || "Password reset instructions sent"}
            </CardDescription>
          </CardHeader>
          <CardContent className={cn(authConfig.globalStyles?.cardContent, forgotPasswordConfig.styles?.cardContent)}>
            <p className={cn(authConfig.globalStyles?.helperText || "text-sm text-muted-foreground")}>
              {forgotPasswordConfig.successDisplay?.text?.helperText || "If you registered using your email and password, you will receive a password reset email."}
            </p>
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
                {forgotPasswordConfig.description?.text || "Type in your email and we'll send you a link to reset your password"}
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
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      className={cn(
                        authConfig.globalStyles?.input,
                        forgotPasswordConfig.email?.styles?.input,
                        fieldErrors.email && "border-red-500 focus-visible:ring-red-500"
                      )}
                      disabled={isLoading}
                    />
                    {fieldErrors.email && (
                      <p className={cn(authConfig.globalStyles?.errorMessage || "text-sm text-red-500", forgotPasswordConfig.email?.styles?.errorMessage)}>
                        {fieldErrors.email}
                      </p>
                    )}
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
                    disabled={isLoading}
                  >
                    {isLoading 
                      ? (forgotPasswordConfig.submitButton?.text?.loadingText || "Sending...") 
                      : (forgotPasswordConfig.submitButton?.text?.buttonText || "Send reset email")
                    }
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
