"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProfileForm } from "@/hooks/auth-modules";
import { useUserStore } from "@/lib/stores/auth-module";
import { useAuthConfig } from "@/config/auth-config";
import type { AuthModuleConfig } from "@/types/auth-config.types";
import { cn } from "@/lib/utils";

interface ProfileFormProps {
  config?: Partial<AuthModuleConfig>;
}

export function ProfileForm({ config }: ProfileFormProps) {
    const {
        formData,
        fieldErrors,
        isLoading,
        error,
        updateField,
        handleSubmit,
        clearError,
        clearFieldError,
        loadProfile,
    } = useProfileForm();

    const authConfig = useAuthConfig(config);
    const profileFormConfig = authConfig.profileForm!;

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    return (
        <Card className={cn(authConfig.globalStyles?.card, profileFormConfig.styles?.card)}>
            <CardHeader className={cn(authConfig.globalStyles?.cardHeader, profileFormConfig.styles?.cardHeader)}>
                {profileFormConfig.title?.show && (
                    <CardTitle className={cn(authConfig.globalStyles?.title, profileFormConfig.styles?.title)}>
                        {profileFormConfig.title?.text || "Edit Profile"}
                    </CardTitle>
                )}
            </CardHeader>
            <CardContent className={cn(authConfig.globalStyles?.cardContent, profileFormConfig.styles?.cardContent)}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {profileFormConfig.firstName?.show && (
                            <div className="space-y-2">
                                <Label 
                                    htmlFor="firstName"
                                    className={cn(authConfig.globalStyles?.label, profileFormConfig.firstName?.styles?.label)}
                                >
                                    {profileFormConfig.firstName?.label || "First Name"}
                                </Label>
                                <Input
                                    id="firstName"
                                    type="text"
                                    placeholder={profileFormConfig.firstName?.placeholder || "John"}
                                    required={profileFormConfig.firstName?.required}
                                    value={formData.firstName}
                                    onChange={(e) => updateField("firstName", e.target.value)}
                                    className={cn(
                                        authConfig.globalStyles?.input,
                                        profileFormConfig.firstName?.styles?.input,
                                        fieldErrors.firstName && "border-red-500 focus-visible:ring-red-500"
                                    )}
                                    disabled={isLoading}
                                />
                                {fieldErrors.firstName && (
                                    <p className={cn(authConfig.globalStyles?.errorMessage || "text-sm text-red-500", profileFormConfig.firstName?.styles?.errorMessage)}>
                                        {fieldErrors.firstName}
                                    </p>
                                )}
                            </div>
                        )}
                        
                        {profileFormConfig.lastName?.show && (
                            <div className="space-y-2">
                                <Label 
                                    htmlFor="lastName"
                                    className={cn(authConfig.globalStyles?.label, profileFormConfig.lastName?.styles?.label)}
                                >
                                    {profileFormConfig.lastName?.label || "Last Name"}
                                </Label>
                                <Input
                                    id="lastName"
                                    type="text"
                                    placeholder={profileFormConfig.lastName?.placeholder || "Doe"}
                                    required={profileFormConfig.lastName?.required}
                                    value={formData.lastName}
                                    onChange={(e) => updateField("lastName", e.target.value)}
                                    className={cn(
                                        authConfig.globalStyles?.input,
                                        profileFormConfig.lastName?.styles?.input,
                                        fieldErrors.lastName && "border-red-500 focus-visible:ring-red-500"
                                    )}
                                    disabled={isLoading}
                                />
                                {fieldErrors.lastName && (
                                    <p className={cn(authConfig.globalStyles?.errorMessage || "text-sm text-red-500", profileFormConfig.lastName?.styles?.errorMessage)}>
                                        {fieldErrors.lastName}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {profileFormConfig.email?.show && (
                        <div className="space-y-2">
                            <Label 
                                htmlFor="email"
                                className={cn(authConfig.globalStyles?.label, profileFormConfig.email?.styles?.label)}
                            >
                                {profileFormConfig.email?.label || "Email"}
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder={profileFormConfig.email?.placeholder || "john@example.com"}
                                required={profileFormConfig.email?.required}
                                disabled={true}
                                value={useUserStore.getState().user?.email}
                                className={cn(authConfig.globalStyles?.input, profileFormConfig.email?.styles?.input)}
                            />
                            <div className={cn("text-xs text-muted-foreground", authConfig.globalStyles?.helperText)}>
                                You cannot change your email address
                            </div>
                            {fieldErrors.email && (
                                <p className={cn(authConfig.globalStyles?.errorMessage || "text-sm text-red-500", profileFormConfig.email?.styles?.errorMessage)}>
                                    {fieldErrors.email}
                                </p>
                            )}
                        </div>
                    )}

                    {profileFormConfig.phone?.show && (
                        <div className="space-y-2">
                            <Label 
                                htmlFor="phone"
                                className={cn(authConfig.globalStyles?.label, profileFormConfig.phone?.styles?.label)}
                            >
                                {profileFormConfig.phone?.label || "Phone (Optional)"}
                            </Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder={profileFormConfig.phone?.placeholder || "+1 (234) 567-8900"}
                                required={profileFormConfig.phone?.required}
                                value={formData.phone || ""}
                                onChange={(e) => updateField("phone", e.target.value)}
                                className={cn(
                                    authConfig.globalStyles?.input,
                                    profileFormConfig.phone?.styles?.input,
                                    fieldErrors.phone && "border-red-500 focus-visible:ring-red-500"
                                )}
                                disabled={isLoading}
                            />
                            {fieldErrors.phone && (
                                <p className={cn(authConfig.globalStyles?.errorMessage || "text-sm text-red-500", profileFormConfig.phone?.styles?.errorMessage)}>
                                    {fieldErrors.phone}
                                </p>
                            )}
                            <p className={cn("text-xs text-muted-foreground", authConfig.globalStyles?.helperText)}>
                                Enter 10-15 digits. You can use spaces, dashes, parentheses, and plus sign.
                            </p>
                        </div>
                    )}

                    {profileFormConfig.bio?.show && (
                        <div className="space-y-2">
                            <Label 
                                htmlFor="bio"
                                className={cn(authConfig.globalStyles?.label, profileFormConfig.bio?.styles?.label)}
                            >
                                {profileFormConfig.bio?.label || "Bio (Optional)"}
                            </Label>
                            <textarea
                                id="bio"
                                className={cn(
                                    "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                                    authConfig.globalStyles?.input,
                                    profileFormConfig.bio?.styles?.input,
                                    fieldErrors.bio && "border-red-500 focus-visible:ring-red-500"
                                )}
                                placeholder={profileFormConfig.bio?.placeholder || "Tell us about yourself..."}
                                required={profileFormConfig.bio?.required}
                                value={formData.bio || ""}
                                onChange={(e) => updateField("bio", e.target.value)}
                                maxLength={profileFormConfig.bio?.validation?.maxLength || 500}
                                disabled={isLoading}
                            />
                            {fieldErrors.bio && (
                                <p className={cn(authConfig.globalStyles?.errorMessage || "text-sm text-red-500", profileFormConfig.bio?.styles?.errorMessage)}>
                                    {fieldErrors.bio}
                                </p>
                            )}
                            <p className={cn("text-xs text-muted-foreground", authConfig.globalStyles?.helperText)}>
                                {(formData.bio || "").length}/{profileFormConfig.bio?.validation?.maxLength || 500} characters
                            </p>
                        </div>
                    )}

                    {profileFormConfig.errorDisplay?.show && error && (
                        <p className={cn(authConfig.globalStyles?.errorMessage || "text-sm text-red-500", profileFormConfig.errorDisplay?.styles?.errorMessage)}>
                            {error}
                        </p>
                    )}

                    {profileFormConfig.submitButton?.show && (
                        <Button 
                            type="submit" 
                            className={cn(
                                authConfig.globalStyles?.button || "w-full",
                                profileFormConfig.submitButton?.styles?.button
                            )} 
                            disabled={isLoading}
                        >
                            {isLoading 
                                ? (profileFormConfig.submitButton?.text?.loadingText || "Saving...") 
                                : (profileFormConfig.submitButton?.text?.buttonText || "Save Changes")
                            }
                        </Button>
                    )}
                </form>
            </CardContent>
        </Card>
    );
} 