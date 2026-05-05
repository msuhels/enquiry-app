"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin-sidebar";
import { useAuth } from "@/hooks/auth-modules";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, logout, userDetails, fetchUserDetails } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && !userDetails) {
      fetchUserDetails();
    }
  }, [isAuthenticated, userDetails, fetchUserDetails]);

  useEffect(() => {
    if (userDetails) {
      if (userDetails.role === "admin") {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      } else if (userDetails.role === "user") {
        router.push("/b2b");
      }
    }
  }, [userDetails, router]);

  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 overflow-hidden flex justify-center items-center">
        <Loader2 className="animate-spin text-[#F97316] h-12 w-12" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden flex">
      {isAuthenticated && <AdminSidebar onLogout={handleLogout} />}
      <main className="flex-1 max-h-svh overflow-auto">{children}</main>
    </div>
  );
}
