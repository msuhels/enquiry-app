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
import { useLoginForm } from "@/hooks/auth-modules";
import { useAuthConfig } from "@/config/auth-config";
import type { AuthModuleConfig } from "@/types/auth-config.types";

interface LoginFormProps extends React.ComponentPropsWithoutRef<"div"> {
  config?: Partial<AuthModuleConfig>;
}

export function LoginForm({ className, config, ...props }: LoginFormProps) {
  const {
    formData,
    fieldErrors,
    isLoginLoading,
    error,
    updateField,
    handleSubmit,
    clearError,
    clearFieldError,
  } = useLoginForm();

  const authConfig = useAuthConfig(config);
  const loginConfig = authConfig.login!;

  return (
    <div
      className={cn(
        authConfig.globalStyles?.container || "flex flex-col gap-6",
        className
      )}
      {...props}
    >
      <Card
        className={cn(authConfig.globalStyles?.card, loginConfig.styles?.card)}
      >
        <CardHeader
          className={cn(
            authConfig.globalStyles?.cardHeader,
            loginConfig.styles?.cardHeader
          )}
        >
          {loginConfig.title?.show && (
            <CardTitle
              className={cn(
                authConfig.globalStyles?.title || "text-2xl",
                loginConfig.styles?.title
              )}
            >
              {loginConfig.title?.text || "Login"}
            </CardTitle>
          )}
          {loginConfig.description?.show && (
            <CardDescription
              className={cn(
                authConfig.globalStyles?.description,
                loginConfig.styles?.description
              )}
            >
              {loginConfig.description?.text ||
                "Enter your email below to login to your account"}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent
          className={cn(
            authConfig.globalStyles?.cardContent,
            loginConfig.styles?.cardContent
          )}
        >
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {loginConfig.email?.show && (
                <div className="grid gap-2">
                  <Label
                    htmlFor="email"
                    className={cn(
                      authConfig.globalStyles?.label,
                      loginConfig.email?.styles?.label
                    )}
                  >
                    {loginConfig.email?.label || "Email"}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={
                      loginConfig.email?.placeholder || "m@example.com"
                    }
                    required={loginConfig.email?.required}
                    value={formData.email}
                    onChange={(e) => {
                      updateField("email", e.target.value);
                      if (error) clearError();
                    }}
                    className={cn(
                      authConfig.globalStyles?.input,
                      loginConfig.email?.styles?.input,
                      fieldErrors.email &&
                        "border-red-500 focus-visible:ring-red-500"
                    )}
                    disabled={isLoginLoading}
                  />
                  {fieldErrors.email && (
                    <p
                      className={cn(
                        authConfig.globalStyles?.errorMessage ||
                          "text-sm text-red-500",
                        loginConfig.email?.styles?.errorMessage
                      )}
                    >
                      {fieldErrors.email}
                    </p>
                  )}
                </div>
              )}

              {loginConfig.password?.show && (
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label
                      htmlFor="password"
                      className={cn(
                        authConfig.globalStyles?.label,
                        loginConfig.password?.styles?.label
                      )}
                    >
                      {loginConfig.password?.label || "Password"}
                    </Label>
                    {loginConfig.forgotPasswordLink?.show && (
                      <Link
                        href="/auth/forgot-password"
                        className={cn(
                          "ml-auto inline-block text-sm hover:underline",
                          authConfig.globalStyles?.link,
                          loginConfig.forgotPasswordLink?.styles?.link
                        )}
                      >
                        {loginConfig.forgotPasswordLink?.text?.linkText ||
                          "Forgot your password?"}
                      </Link>
                    )}
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder={loginConfig.password?.placeholder}
                    required={loginConfig.password?.required}
                    value={formData.password}
                    onChange={(e) => {
                      updateField("password", e.target.value);
                      if (error) clearError();
                    }}
                    className={cn(
                      authConfig.globalStyles?.input,
                      loginConfig.password?.styles?.input,
                      fieldErrors.password &&
                        "border-red-500 focus-visible:ring-red-500"
                    )}
                    disabled={isLoginLoading}
                  />
                  {fieldErrors.password && (
                    <p
                      className={cn(
                        authConfig.globalStyles?.errorMessage ||
                          "text-sm text-red-500",
                        loginConfig.password?.styles?.errorMessage
                      )}
                    >
                      {fieldErrors.password}
                    </p>
                  )}
                </div>
              )}

              {loginConfig.errorDisplay?.show &&
                error &&
                error !== "Auth session missing!" && (
                  <div
                    className={cn(
                      "text-sm text-red-500 bg-red-50 p-3 rounded-md border border-red-200 flex items-center gap-2",
                      authConfig.globalStyles?.errorMessage,
                      loginConfig.errorDisplay?.styles?.errorMessage
                    )}
                  >
                    <svg
                      className="w-4 h-4 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {error}
                  </div>
                )}

              {loginConfig.submitButton?.show && (
                <Button
                  type="submit"
                  className={cn(
                    authConfig.globalStyles?.button || "w-full",
                    loginConfig.submitButton?.styles?.button
                  )}
                  disabled={
                    isLoginLoading || !formData.email || !formData.password
                  }
                >
                  {isLoginLoading ? (
                    <div className="flex items-center gap-2">
                      <LoadingSpinner size="sm" />
                      {loginConfig.submitButton?.text?.loadingText ||
                        "Signing in..."}
                    </div>
                  ) : (
                    loginConfig.submitButton?.text?.buttonText || "Sign in"
                  )}
                </Button>
              )}
            </div>

            {loginConfig.signUpLink?.show && (
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  href="/auth/sign-up"
                  className={cn(
                    authConfig.globalStyles?.link,
                    loginConfig.signUpLink?.styles?.link
                  )}
                >
                  {loginConfig.signUpLink?.text?.linkText?.split("? ")[1] ||
                    "Sign up"}
                </Link>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
