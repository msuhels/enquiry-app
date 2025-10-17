"use client";

import { cn, getPasswordStrengthLabel, getPasswordStrengthColor } from "@/lib/utils";
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
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useSignUpForm } from "@/hooks/auth-modules";
import { useAuthConfig } from "@/config/auth-config";
import type { AuthModuleConfig } from "@/types/auth-config.types";

interface SignUpFormProps extends React.ComponentPropsWithoutRef<"div"> {
  config?: Partial<AuthModuleConfig>;
}

export function SignUpForm({
  className,
  config,
  ...props
}: SignUpFormProps) {
  const {
    formData,
    fieldErrors,
    isLoading,
    error,
    passwordStrength,
    updateField,
    handleSubmit,
    clearError,
    clearFieldError,
  } = useSignUpForm();

  const authConfig = useAuthConfig(config);
  const signUpConfig = authConfig.signUp!;

  return (
    <div className={cn(authConfig.globalStyles?.container || "flex flex-col gap-6", className)} {...props}>
      <Card className={cn(authConfig.globalStyles?.card, signUpConfig.styles?.card)}>
        <CardHeader className={cn(authConfig.globalStyles?.cardHeader, signUpConfig.styles?.cardHeader)}>
          {signUpConfig.title?.show && (
            <CardTitle className={cn(authConfig.globalStyles?.title || "text-2xl", signUpConfig.styles?.title)}>
              {signUpConfig.title?.text || "Sign up"}
            </CardTitle>
          )}
          {signUpConfig.description?.show && (
            <CardDescription className={cn(authConfig.globalStyles?.description, signUpConfig.styles?.description)}>
              {signUpConfig.description?.text || "Create a new account"}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className={cn(authConfig.globalStyles?.cardContent, signUpConfig.styles?.cardContent)}>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {signUpConfig.email?.show && (
                <div className="grid gap-2">
                  <Label 
                    htmlFor="email"
                    className={cn(authConfig.globalStyles?.label, signUpConfig.email?.styles?.label)}
                  >
                    {signUpConfig.email?.label || "Email"}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={signUpConfig.email?.placeholder || "m@example.com"}
                    required={signUpConfig.email?.required}
                    value={formData.email}
                    onChange={(e) => {
                      updateField("email", e.target.value);
                      if (error) clearError();
                    }}
                    className={cn(
                      authConfig.globalStyles?.input,
                      signUpConfig.email?.styles?.input,
                      fieldErrors.email && "border-red-500 focus-visible:ring-red-500"
                    )}
                    disabled={isLoading}
                  />
                  {fieldErrors.email && (
                    <p className={cn(authConfig.globalStyles?.errorMessage || "text-sm text-red-500", signUpConfig.email?.styles?.errorMessage)}>
                      {fieldErrors.email}
                    </p>
                  )}
                </div>
              )}
              {signUpConfig.password?.show && (
                <div className="grid gap-2">
                  <Label 
                    htmlFor="password"
                    className={cn(authConfig.globalStyles?.label, signUpConfig.password?.styles?.label)}
                  >
                    {signUpConfig.password?.label || "Password"}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder={signUpConfig.password?.placeholder || "Enter a strong password"}
                    required={signUpConfig.password?.required}
                    value={formData.password}
                    onChange={(e) => {
                      updateField("password", e.target.value);
                      if (error) clearError();
                    }}
                    className={cn(
                      authConfig.globalStyles?.input,
                      signUpConfig.password?.styles?.input,
                      fieldErrors.password && "border-red-500 focus-visible:ring-red-500"
                    )}
                    disabled={isLoading}
                  />
                  {fieldErrors.password && (
                    <p className={cn(authConfig.globalStyles?.errorMessage || "text-sm text-red-500", signUpConfig.password?.styles?.errorMessage)}>
                      {fieldErrors.password}
                    </p>
                  )}

                  {/* Password Strength Indicator */}
                  {formData.password && signUpConfig.password?.showStrengthIndicator && (
                    <div className="space-y-3">
                      {signUpConfig.password?.strengthIndicator?.showLabel && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Password Strength:</span>
                          <Badge
                            variant={passwordStrength.score >= 3 ? "default" : "secondary"}
                            className={cn(
                              "text-xs",
                              authConfig.globalStyles?.badge,
                              passwordStrength.score === 0 && (signUpConfig.password?.strengthIndicator?.colors?.weak || "bg-red-100 text-red-700 hover:bg-red-100"),
                              passwordStrength.score === 1 && (signUpConfig.password?.strengthIndicator?.colors?.fair || "bg-red-50 text-red-600 hover:bg-red-50"),
                              passwordStrength.score === 2 && (signUpConfig.password?.strengthIndicator?.colors?.good || "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"),
                              passwordStrength.score === 3 && (signUpConfig.password?.strengthIndicator?.colors?.strong || "bg-blue-100 text-blue-700 hover:bg-blue-100"),
                              passwordStrength.score === 4 && (signUpConfig.password?.strengthIndicator?.colors?.veryStrong || "bg-green-100 text-green-700 hover:bg-green-100")
                            )}
                          >
                            {getPasswordStrengthLabel(passwordStrength.score)}
                          </Badge>
                        </div>
                      )}

                      {/* Progress Bar */}
                      {signUpConfig.password?.strengthIndicator?.showProgressBar && (
                        <div className={cn(authConfig.globalStyles?.progressBar || "w-full bg-muted rounded-full h-2")}>
                          <div
                            className={cn(
                              "h-2 rounded-full transition-all duration-300",
                              passwordStrength.score === 0 && (signUpConfig.password?.strengthIndicator?.colors?.weak || "bg-red-500"),
                              passwordStrength.score === 1 && (signUpConfig.password?.strengthIndicator?.colors?.fair || "bg-red-400"),
                              passwordStrength.score === 2 && (signUpConfig.password?.strengthIndicator?.colors?.good || "bg-yellow-500"),
                              passwordStrength.score === 3 && (signUpConfig.password?.strengthIndicator?.colors?.strong || "bg-blue-500"),
                              passwordStrength.score === 4 && (signUpConfig.password?.strengthIndicator?.colors?.veryStrong || "bg-green-500")
                            )}
                            style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                          />
                        </div>
                      )}

                      {/* Requirements List */}
                      {signUpConfig.password?.strengthIndicator?.showRequirements && passwordStrength.feedback.length > 0 && (
                        <div className={cn("text-xs text-muted-foreground bg-muted/50 p-3 rounded-md", authConfig.globalStyles?.helperText)}>
                          <p className="font-medium mb-2">Password must contain:</p>
                          <ul className="space-y-1">
                            {passwordStrength.feedback.map((requirement, index) => (
                              <li key={index} className="flex items-center space-x-2">
                                <span className="w-1 h-1 bg-muted-foreground rounded-full flex-shrink-0" />
                                <span>{requirement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* All requirements met */}
                      {passwordStrength.feedback.length === 0 && passwordStrength.score >= 3 && (
                        <div className={cn("flex items-center space-x-2 text-xs text-green-600 bg-green-50 p-2 rounded-md", authConfig.globalStyles?.successMessage)}>
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>All password requirements met</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              {signUpConfig.confirmPassword?.show && (
                <div className="grid gap-2">
                  <Label 
                    htmlFor="confirmPassword"
                    className={cn(authConfig.globalStyles?.label, signUpConfig.confirmPassword?.styles?.label)}
                  >
                    {signUpConfig.confirmPassword?.label || "Confirm Password"}
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder={signUpConfig.confirmPassword?.placeholder || "Confirm your password"}
                    required={signUpConfig.confirmPassword?.required}
                    value={formData.confirmPassword}
                    onChange={(e) => {
                      updateField("confirmPassword", e.target.value);
                      if (error) clearError();
                    }}
                    className={cn(
                      authConfig.globalStyles?.input,
                      signUpConfig.confirmPassword?.styles?.input,
                      fieldErrors.confirmPassword && "border-red-500 focus-visible:ring-red-500"
                    )}
                    disabled={isLoading}
                  />
                  {fieldErrors.confirmPassword && (
                    <p className={cn(authConfig.globalStyles?.errorMessage || "text-sm text-red-500", signUpConfig.confirmPassword?.styles?.errorMessage)}>
                      {fieldErrors.confirmPassword}
                    </p>
                  )}

                  {/* Password Match Indicator */}
                  {signUpConfig.passwordMatch?.show && formData.confirmPassword && formData.password && (
                    <div className="flex items-center space-x-2 text-xs">
                      {formData.password === formData.confirmPassword ? (
                        <div className={cn("flex items-center space-x-1 text-green-600", authConfig.globalStyles?.successMessage)}>
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>{signUpConfig.passwordMatch?.text?.successText || "Passwords match"}</span>
                        </div>
                      ) : (
                        <div className={cn("flex items-center space-x-1 text-red-500", authConfig.globalStyles?.errorMessage)}>
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          <span>{signUpConfig.passwordMatch?.text?.errorText || "Passwords do not match"}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              {signUpConfig.errorDisplay?.show && error && error !== "Auth session missing!" && (
                <div className={cn(
                  "text-sm text-red-500 bg-red-50 p-3 rounded-md border border-red-200 flex items-center gap-2",
                  authConfig.globalStyles?.errorMessage,
                  signUpConfig.errorDisplay?.styles?.errorMessage
                )}>
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
              
              {signUpConfig.submitButton?.show && (
                <Button
                  type="submit"
                  className={cn(
                    authConfig.globalStyles?.button || "w-full",
                    signUpConfig.submitButton?.styles?.button
                  )}
                  disabled={
                    isLoading ||
                    !formData.email ||
                    !formData.password ||
                    !formData.confirmPassword ||
                    formData.password !== formData.confirmPassword ||
                    passwordStrength.score < 3
                  }
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <LoadingSpinner size="sm" />
                      {signUpConfig.submitButton?.text?.loadingText || "Creating account..."}
                    </div>
                  ) : (
                    signUpConfig.submitButton?.text?.buttonText || "Create account"
                  )}
                </Button>
              )}

              {/* Submit Requirements */}
              {(!formData.email || !formData.password || !formData.confirmPassword) && (
                <p className={cn("text-xs text-muted-foreground text-center", authConfig.globalStyles?.helperText)}>
                  Please fill in all required fields
                </p>
              )}
              {formData.email && formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className={cn("text-xs text-red-500 text-center", authConfig.globalStyles?.errorMessage)}>
                  Passwords must match to continue
                </p>
              )}
              {formData.email && formData.password && formData.confirmPassword && formData.password === formData.confirmPassword && passwordStrength.score < 3 && (
                <p className="text-xs text-amber-600 text-center">
                  Password must be stronger to create account
                </p>
              )}
            </div>
            
            {signUpConfig.loginLink?.show && (
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link 
                  href="/auth/login" 
                  className={cn(
                    authConfig.globalStyles?.link,
                    signUpConfig.loginLink?.styles?.link
                  )}
                >
                  {signUpConfig.loginLink?.text?.linkText?.split('? ')[1] || "Sign in"}
                </Link>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
