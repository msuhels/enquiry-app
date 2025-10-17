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
import { useUpdatePasswordForm } from "@/hooks/auth-modules";
import { useAuthConfig } from "@/config/auth-config";
import type { AuthModuleConfig } from "@/types/auth-config.types";

interface UpdatePasswordFormProps extends React.ComponentPropsWithoutRef<"div"> {
  config?: Partial<AuthModuleConfig>;
}

export function UpdatePasswordForm({
  className,
  config,
  ...props
}: UpdatePasswordFormProps) {
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
  } = useUpdatePasswordForm();

  const authConfig = useAuthConfig(config);
  const updatePasswordConfig = authConfig.updatePassword!;

  return (
    <div className={cn(authConfig.globalStyles?.container || "flex flex-col gap-6", className)} {...props}>
      <Card className={cn(authConfig.globalStyles?.card, updatePasswordConfig.styles?.card)}>
        <CardHeader className={cn(authConfig.globalStyles?.cardHeader, updatePasswordConfig.styles?.cardHeader)}>
          {updatePasswordConfig.title?.show && (
            <CardTitle className={cn(authConfig.globalStyles?.title || "text-2xl", updatePasswordConfig.styles?.title)}>
              {updatePasswordConfig.title?.text || "Reset Your Password"}
            </CardTitle>
          )}
          {updatePasswordConfig.description?.show && (
            <CardDescription className={cn(authConfig.globalStyles?.description, updatePasswordConfig.styles?.description)}>
              {updatePasswordConfig.description?.text || "Please enter your new password below."}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className={cn(authConfig.globalStyles?.cardContent, updatePasswordConfig.styles?.cardContent)}>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {updatePasswordConfig.password?.show && (
                <div className="grid gap-2">
                  <Label 
                    htmlFor="password"
                    className={cn(authConfig.globalStyles?.label, updatePasswordConfig.password?.styles?.label)}
                  >
                    {updatePasswordConfig.password?.label || "New password"}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder={updatePasswordConfig.password?.placeholder || "New password"}
                    required={updatePasswordConfig.password?.required}
                    value={formData.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    className={cn(
                      authConfig.globalStyles?.input,
                      updatePasswordConfig.password?.styles?.input,
                      fieldErrors.password && "border-red-500 focus-visible:ring-red-500"
                    )}
                    disabled={isLoading}
                  />
                  {fieldErrors.password && (
                    <p className={cn(authConfig.globalStyles?.errorMessage || "text-sm text-red-500", updatePasswordConfig.password?.styles?.errorMessage)}>
                      {fieldErrors.password}
                    </p>
                  )}
                  
                  {/* Password Strength Indicator */}
                  {formData.password && updatePasswordConfig.password?.showStrengthIndicator && (
                    <div className="space-y-2">
                      {updatePasswordConfig.password?.strengthIndicator?.showLabel && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Password Strength:</span>
                          <span className={cn("text-sm font-medium", getPasswordStrengthColor(passwordStrength.score))}>
                            {getPasswordStrengthLabel(passwordStrength.score)}
                          </span>
                        </div>
                      )}
                      
                      {/* Progress Bar */}
                      {updatePasswordConfig.password?.strengthIndicator?.showProgressBar && (
                        <div className={cn(authConfig.globalStyles?.progressBar || "w-full bg-gray-200 rounded-full h-2")}>
                          <div
                            className={cn(
                              "h-2 rounded-full transition-all duration-300",
                              passwordStrength.score === 0 && "bg-red-600",
                              passwordStrength.score === 1 && "bg-red-500",
                              passwordStrength.score === 2 && "bg-yellow-500",
                              passwordStrength.score === 3 && "bg-blue-500",
                              passwordStrength.score === 4 && "bg-green-500"
                            )}
                            style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                          />
                        </div>
                      )}
                      
                      {/* Requirements List */}
                      {updatePasswordConfig.password?.strengthIndicator?.showRequirements && passwordStrength.feedback.length > 0 && (
                        <div className={cn("text-xs text-gray-600", authConfig.globalStyles?.helperText)}>
                          <p className="font-medium mb-1">Password must contain:</p>
                          <ul className="space-y-0.5">
                            {passwordStrength.feedback.map((requirement, index) => (
                              <li key={index} className="flex items-center space-x-1">
                                <span className="text-red-500">•</span>
                                <span>{requirement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {/* All requirements met */}
                      {passwordStrength.feedback.length === 0 && passwordStrength.score >= 3 && (
                        <p className={cn("text-xs text-green-600", authConfig.globalStyles?.successMessage)}>
                          ✓ All password requirements met
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
              {updatePasswordConfig.confirmPassword?.show && (
                <div className="grid gap-2">
                  <Label 
                    htmlFor="confirmPassword"
                    className={cn(authConfig.globalStyles?.label, updatePasswordConfig.confirmPassword?.styles?.label)}
                  >
                    {updatePasswordConfig.confirmPassword?.label || "Confirm new password"}
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder={updatePasswordConfig.confirmPassword?.placeholder || "Confirm new password"}
                    required={updatePasswordConfig.confirmPassword?.required}
                    value={formData.confirmPassword}
                    onChange={(e) => updateField("confirmPassword", e.target.value)}
                    className={cn(
                      authConfig.globalStyles?.input,
                      updatePasswordConfig.confirmPassword?.styles?.input,
                      fieldErrors.confirmPassword && "border-red-500 focus-visible:ring-red-500"
                    )}
                    disabled={isLoading}
                  />
                  {fieldErrors.confirmPassword && (
                    <p className={cn(authConfig.globalStyles?.errorMessage || "text-sm text-red-500", updatePasswordConfig.confirmPassword?.styles?.errorMessage)}>
                      {fieldErrors.confirmPassword}
                    </p>
                  )}
                </div>
              )}
              
              {updatePasswordConfig.errorDisplay?.show && error && (
                <p className={cn(authConfig.globalStyles?.errorMessage || "text-sm text-red-500", updatePasswordConfig.errorDisplay?.styles?.errorMessage)}>
                  {error}
                </p>
              )}
              
              {updatePasswordConfig.submitButton?.show && (
                <Button 
                  type="submit" 
                  className={cn(
                    authConfig.globalStyles?.button || "w-full",
                    updatePasswordConfig.submitButton?.styles?.button
                  )} 
                  disabled={isLoading}
                >
                  {isLoading 
                    ? (updatePasswordConfig.submitButton?.text?.loadingText || "Saving...") 
                    : (updatePasswordConfig.submitButton?.text?.buttonText || "Save new password")
                  }
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
