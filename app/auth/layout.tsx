"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth-modules";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFetch } from "@/hooks/api/useFetch";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading, getCurrentUser } = useAuth();
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("");
  const { data } = useFetch("/api/admin/users/getAuthUser");

  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  useEffect(() => {
    if (data) {
      setUserName(data.userDetails.name);
    }
  }, [data]);

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
      }
    };

    fetchUserRole();
  }, [isAuthenticated]);

  useEffect(() => {
    if (userRole === "admin") {
      const t = setTimeout(() => router.push("/admin"), 2000);
      return () => clearTimeout(t);
    } else if (userRole === "user") {
      const t = setTimeout(() => router.push("/b2b"), 2000);
      return () => clearTimeout(t);
    }
  }, [userRole, router]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
        <Card className="w-[380px]">
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground">
              Checking authentication status...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
        <Card className="w-[380px]">
          <CardHeader>
            <CardTitle>Welcome, {userName || "Back"}!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Redirecting you to your dashboard...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <div>{children}</div>;
}