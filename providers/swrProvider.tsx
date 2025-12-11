'use client'
import { SWRConfig } from "swr";
export  function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig fetcher={(url) => fetch(url).then((res) => res.json())}>
      {children}
    </SWRConfig>
  );
}
