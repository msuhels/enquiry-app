"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin-sidebar";
import { useAuth } from "@/hooks/auth-modules";
import { useFetch } from "@/hooks/api/useFetch";
import UserSidebar from "@/components/vendor-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden flex">
      {isAuthenticated && <UserSidebar onLogout={handleLogout} />}
      <main className="flex-1 max-h-svh overflow-auto">{children}</main>
    </div>
  );
}
