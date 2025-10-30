"use client";

import { useFetch } from "@/hooks/api/useFetch";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [userRole, setUserRole] = useState("");
  const { data } = useFetch("/api/admin/users/getAuthUser");

  useEffect(() => {
    if (data) {
      setUserRole(data.userDetails.role);
    }
  }, [data]);

  useEffect(() => {
    if (userRole === "admin") {
      router.push("/admin");
    } else if (userRole === "user") {
      router.push("/b2b");
    }
  }, [userRole]);

  useEffect(() => {
    router.push("/auth/login");
  }, []);

  return <></>;
}
