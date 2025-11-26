"use client";

import { useInitializeIp } from "@/hooks/auth-modules";

export function IpInitializer() {
  useInitializeIp();
  return null;
}
