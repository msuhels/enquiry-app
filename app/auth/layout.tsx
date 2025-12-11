"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth-modules";
import { Loader2 } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading, getCurrentUser } = useAuth();
  const [userRole, setUserRole] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);

  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  useEffect(() => {
    if (!isAuthenticated || isCheckingAuth) return;

    const fetchUserRole = async () => {
      setIsCheckingAuth(true);
      try {
        const res = await fetch("/api/admin/users/getAuthUser");
        
        if (res.status === 401) {
          setIsCheckingAuth(false);
          return;
        }

        const data = await res.json();
        
        if (data?.userDetails?.role) {
          localStorage.setItem("showedWelcome", "false");
          setUserRole(data.userDetails.role);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    fetchUserRole();
  }, [isAuthenticated, isCheckingAuth]);

  useEffect(() => {
    if (userRole === "admin") {
      router.push("/admin");
    } else if (userRole === "user") {
      router.push("/b2b");
    }
  }, [userRole, router]);

  if (isLoading || isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 overflow-hidden flex justify-center items-center">
        <Loader2 className="animate-spin text-indigo-600 h-12 w-12" />
      </div>
    );
  }

  return <div>{children}</div>;
}