"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin-sidebar";
import { useAuth } from "@/hooks/auth-modules";
import { Loader2 } from "lucide-react";
// import { useFetch } from "@/hooks/api/useFetch";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();
  const [userRole, setUserRole] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/admin/users/getAuthUser");
      const data = await res.json();
      return data;
    };

    const fetchUserRole = async () => {
      const data = await fetchUser();
      if (data) {
        setUserRole(data.userDetails.role);
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    };

    fetchUserRole();
  }, [isAuthenticated]);

  useEffect(() => {
    if (userRole === "admin") {
      router.push("/admin");
    } else if (userRole === "user") {
      router.push("/b2b");
    }
  }, [userRole]);

  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 overflow-hidden flex justify-center items-center">
        <Loader2 className="animate-spin text-indigo-600 h-12 w-12" />
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
