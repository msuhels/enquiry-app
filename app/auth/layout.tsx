"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth-modules";
import { Loader2 } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading, getCurrentUser, userDetails, fetchUserDetails } = useAuth();

  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  useEffect(() => {
    if (isAuthenticated && !userDetails) {
      fetchUserDetails();
    }
  }, [isAuthenticated, userDetails, fetchUserDetails]);

  useEffect(() => {
    if (isAuthenticated && userDetails) {
      localStorage.setItem("showedWelcome", "false");
      
      if (userDetails.role === "admin") {
        router.push("/admin");
      } else if (userDetails.role === "user") {
        router.push("/b2b");
      }
    }
  }, [isAuthenticated, userDetails, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 overflow-hidden flex justify-center items-center">
        <Loader2 className="animate-spin text-indigo-600 h-12 w-12" />
      </div>
    );
  }

  return <div>{children}</div>;
}