"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/auth-modules";
import { useAuthConfig } from "@/config/auth-config";
import type { AuthModuleConfig } from "@/types/auth-config.types";
import { cn } from "@/lib/utils";

interface ProfileActionsProps {
  config?: Partial<AuthModuleConfig>;
}

export function ProfileActions({ config }: ProfileActionsProps) {
    const { logout, isLogoutLoading } = useAuth();

    const authConfig = useAuthConfig(config);
    const profileActionsConfig = authConfig.profileActions!;

    const handleLogout = async () => {
        await logout();
    };

    return (
        <Card className={cn(authConfig.globalStyles?.card, profileActionsConfig.styles?.card)}>
            <CardHeader className={cn(authConfig.globalStyles?.cardHeader, profileActionsConfig.styles?.cardHeader)}>
                {profileActionsConfig.title?.show && (
                    <CardTitle className={cn(authConfig.globalStyles?.title, profileActionsConfig.styles?.title)}>
                        {profileActionsConfig.title?.text || "Account Actions"}
                    </CardTitle>
                )}
            </CardHeader>
            <CardContent className={cn(authConfig.globalStyles?.cardContent, profileActionsConfig.styles?.cardContent, "space-y-4")}>
                {profileActionsConfig.changePassword?.show && (
                    <div className="space-y-2">
                        <h4 className={cn("text-sm font-medium", authConfig.globalStyles?.label)}>
                            {profileActionsConfig.changePassword?.text?.title || "Security"}
                        </h4>
                        <p className={cn("text-xs text-muted-foreground", authConfig.globalStyles?.helperText)}>
                            {profileActionsConfig.changePassword?.text?.description || "Manage your account security and access."}
                        </p>
                        <Button
                            variant="outline"
                            className={cn(
                                authConfig.globalStyles?.button || "w-full",
                                profileActionsConfig.changePassword?.styles?.button
                            )}
                            onClick={() => window.location.href = '/dashboard/profile/update-password'}
                        >
                            {profileActionsConfig.changePassword?.text?.buttonText || "Change Password"}
                        </Button>
                    </div>
                )}

                {profileActionsConfig.signOut?.show && (
                    <div className="space-y-2">
                        <h4 className={cn("text-sm font-medium", authConfig.globalStyles?.label)}>
                            {profileActionsConfig.signOut?.text?.title || "Session"}
                        </h4>
                        <p className={cn("text-xs text-muted-foreground", authConfig.globalStyles?.helperText)}>
                            {profileActionsConfig.signOut?.text?.description || "Sign out of your account on this device."}
                        </p>
                        <Button
                            variant="destructive"
                            className={cn(
                                authConfig.globalStyles?.button || "w-full",
                                profileActionsConfig.signOut?.styles?.button
                            )}
                            onClick={handleLogout}
                            disabled={isLogoutLoading}
                        >
                            {isLogoutLoading 
                                ? (profileActionsConfig.signOut?.text?.loadingText || "Signing out...") 
                                : (profileActionsConfig.signOut?.text?.buttonText || "Sign Out")
                            }
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
} 