"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useProfile } from "@/hooks/auth-modules";
import type { UserProfile } from "@/lib/supabase/auth-module/services/user.services";
import { useAuthConfig } from "@/config/auth-config";
import type { AuthModuleConfig } from "@/types/auth-config.types";
import { cn } from "@/lib/utils";

interface ProfileInfoProps {
  config?: Partial<AuthModuleConfig>;
}

export function ProfileInfo({ config }: ProfileInfoProps) {
  const { getProfile } = useProfile();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const authConfig = useAuthConfig(config);
  const profileInfoConfig = authConfig.profileInfo!;

  useEffect(() => {
    const loadProfile = async () => {
      const profile = await getProfile();
      if (profile) {
        setUserProfile(profile);
      }
    };
    
    loadProfile();
  }, [getProfile]);

  return (
    <Card className={cn(authConfig.globalStyles?.card, profileInfoConfig.styles?.card)}>
      <CardHeader className={cn(authConfig.globalStyles?.cardHeader, profileInfoConfig.styles?.cardHeader)}>
        {profileInfoConfig.title?.show && (
          <CardTitle className={cn(authConfig.globalStyles?.title, profileInfoConfig.styles?.title)}>
            {profileInfoConfig.title?.text || "Profile Information"}
          </CardTitle>
        )}
      </CardHeader>
      <CardContent className={cn(authConfig.globalStyles?.cardContent, profileInfoConfig.styles?.cardContent, "space-y-4")}>
        {profileInfoConfig.fields?.email?.show && (
          <div className="flex items-center justify-between">
            <span className={cn("text-sm font-medium", authConfig.globalStyles?.label)}>
              {profileInfoConfig.fields?.email?.text?.label || "Email:"}
            </span>
            <span className={cn("text-sm text-muted-foreground", authConfig.globalStyles?.helperText)}>
              {userProfile?.email || "Not provided"}
            </span>
          </div>
        )}
        
        {profileInfoConfig.fields?.status?.show && (
          <div className="flex items-center justify-between">
            <span className={cn("text-sm font-medium", authConfig.globalStyles?.label)}>
              {profileInfoConfig.fields?.status?.text?.label || "Status:"}
            </span>
            <Badge 
              variant={userProfile?.email_verified ? "default" : "secondary"}
              className={cn(authConfig.globalStyles?.badge, profileInfoConfig.fields?.status?.styles?.badge)}
            >
              {userProfile?.email_verified ? "Verified" : "Unverified"}
            </Badge>
          </div>
        )}
        
        {profileInfoConfig.fields?.role?.show && (
          <div className="flex items-center justify-between">
            <span className={cn("text-sm font-medium", authConfig.globalStyles?.label)}>
              {profileInfoConfig.fields?.role?.text?.label || "Role:"}
            </span>
            <Badge 
              variant="outline"
              className={cn(authConfig.globalStyles?.badge, profileInfoConfig.fields?.role?.styles?.badge)}
            >
              {userProfile?.role || "User"}
            </Badge>
          </div>
        )}
        
        {profileInfoConfig.fields?.memberSince?.show && (
          <div className="flex items-center justify-between">
            <span className={cn("text-sm font-medium", authConfig.globalStyles?.label)}>
              {profileInfoConfig.fields?.memberSince?.text?.label || "Member since:"}
            </span>
            <span className={cn("text-sm text-muted-foreground", authConfig.globalStyles?.helperText)}>
              {userProfile?.created_at ? new Date(userProfile.created_at).toLocaleDateString() : "Unknown"}
            </span>
          </div>
        )}
        
        {profileInfoConfig.fields?.lastSignIn?.show && (
          <div className="flex items-center justify-between">
            <span className={cn("text-sm font-medium", authConfig.globalStyles?.label)}>
              {profileInfoConfig.fields?.lastSignIn?.text?.label || "Last sign in:"}
            </span>
            <span className={cn("text-sm text-muted-foreground", authConfig.globalStyles?.helperText)}>
              {userProfile?.last_login_at ? new Date(userProfile.last_login_at).toLocaleDateString() : "Unknown"}
            </span>
          </div>
        )}
        
        {profileInfoConfig.fields?.accountStatus?.show && (
          <div className="flex items-center justify-between">
            <span className={cn("text-sm font-medium", authConfig.globalStyles?.label)}>
              {profileInfoConfig.fields?.accountStatus?.text?.label || "Account Status:"}
            </span>
            <Badge 
              variant={userProfile?.status === "active" ? "default" : "destructive"}
              className={cn(authConfig.globalStyles?.badge, profileInfoConfig.fields?.accountStatus?.styles?.badge)}
            >
              {userProfile?.status || "Unknown"}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 