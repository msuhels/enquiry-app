'use client'
import { SWRConfig } from "swr";

export function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig 
      value={{
        fetcher: (url) => fetch(url).then((res) => res.json()),
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        refreshInterval: 0,
        dedupingInterval: 10000,
        shouldRetryOnError: false,
        errorRetryCount: 0,
      }}
    >
      {children}
    </SWRConfig>
  );
}
