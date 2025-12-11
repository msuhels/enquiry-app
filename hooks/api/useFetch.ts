"use client";

import useSWR, { SWRConfiguration } from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
  return res.json();
};

/**
 * SWR-based GET hook (auto revalidates)
 */
export function useFetch<T = any>(url: string | null, options?: SWRConfiguration, revalidateOnFocus?: boolean) {
  const { data, error, isLoading, mutate } = useSWR<T>(url, fetcher, {
    revalidateOnFocus: revalidateOnFocus !== false,
    revalidateOnMount: true,
    revalidateIfStale: false, 
    refreshInterval: 0,
    dedupingInterval: 10000,
    shouldRetryOnError: false,
    ...options,
  });

  return { data, error, isLoading, mutate };
}
