"use client";

import { useEffect } from "react";
import { useUserStore } from "@/lib/stores/auth-module";

export function useInitializeIp() {
  useEffect(() => {
    const { fetchIp } = useUserStore.getState();
    fetchIp();
  }, []);
}
