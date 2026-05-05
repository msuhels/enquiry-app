"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/hooks/auth-modules";

export default function Home() {
  const router = useRouter();
  const { userDetails, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && userDetails) {
      if (userDetails.role === "admin") {
        router.push("/admin");
      } else if (userDetails.role === "user") {
        router.push("/b2b");
      }
    } else {
      router.push("/auth/login");
    }
  }, [userDetails, isAuthenticated, router]);

  return <></>;
}
