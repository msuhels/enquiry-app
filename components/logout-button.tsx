"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/auth-modules";

export function LogoutButton() {
  const { logout, isLoading } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Button
      variant="outline"
      onClick={handleLogout}
      disabled={isLoading}
    >
      {isLoading ? "Signing out..." : "Sign out"}
    </Button>
  );
}
