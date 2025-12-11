"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Directly redirect to login - no need to check auth here
    // Middleware will handle authentication checks
    router.push("/auth/login");
  }, [router]);

  return <></>;
}
