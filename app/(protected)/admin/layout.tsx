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
  const { isAuthenticated, logout } = useAuth();
  const [userRole, setUserRole] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    // Only fetch once when component mounts
    if (hasFetched) return;

    const fetchUserRole = async () => {
      try {
        const res = await fetch("/api/admin/users/getAuthUser");
        
        // If unauthorized, redirect to login
        if (res.status === 401) {
          router.push("/auth/login");
          return;
        }

        const data = await res.json();
        
        if (data?.userDetails?.role) {
          setUserRole(data.userDetails.role);
          
          // Redirect if not admin
          if (data.userDetails.role !== "admin") {
            router.push("/b2b");
          }
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        router.push("/auth/login");
      } finally {
        setIsLoading(false);
        setHasFetched(true);
      }
    };

    fetchUserRole();
  }, [hasFetched, router]);

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
