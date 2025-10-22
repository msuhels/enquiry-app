// import useSWR, { SWRConfiguration } from "swr";

// const fetcher = async (url: string) => {
//   const res = await fetch(url);
//   if (!res.ok) {
//     throw new Error(`Error ${res.status}: ${res.statusText}`);
//   }
//   return res.json();
// };

// export function useFetch<T = any>(url: string | null, options?: SWRConfiguration) {
//   const { data, error, isLoading, mutate } = useSWR<T>(url, fetcher, {
//     revalidateOnFocus: true,
//     dedupingInterval: 10000,
//     ...options,
//   });

//   return { data, error, isLoading, mutate };
// }

"use client";

import useSWR, { SWRConfiguration } from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
  return res.json();
};

/**
 * useApi hook: GET with SWR + POST/PUT/DELETE mutations
 */
export function useApi<T = any>(url: string | null, options?: SWRConfiguration) {
  // SWR GET
  const { data, error, isLoading, mutate } = useSWR<T>(url, fetcher, {
    revalidateOnFocus: true,
    dedupingInterval: 10000,
    ...options,
  });

  // Generic mutation function
  const mutateData = async (
    method: "POST" | "PUT" | "DELETE",
    body?: any,
    endpoint?: string
  ) => {
    const targetUrl = endpoint || url;
    if (!targetUrl) throw new Error("No URL provided for mutation");

    const res = await fetch(targetUrl, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) throw new Error(`Failed ${method} request`);

    const result = await res.json();

    // Optimistically update cache for GET endpoint
    if (method === "POST") {
      mutate((currentData: any) => [...(currentData || []), result], { revalidate: false });
    } else if (method === "PUT") {
      mutate((currentData: any) =>
        (currentData || []).map((item: any) => (item.id === result.id ? result : item)),
        { revalidate: false }
      );
    } else if (method === "DELETE") {
      mutate((currentData: any) => (currentData || []).filter((item: any) => item.id !== result.id), { revalidate: false });
    }

    return result;
  };

  return {
    data,
    error,
    isLoading,
    mutate,
    post: (body: any, endpoint?: string) => mutateData("POST", body, endpoint),
    put: (body: any, endpoint?: string) => mutateData("PUT", body, endpoint),
    del: (endpoint?: string) => mutateData("DELETE", undefined, endpoint),
  };
}
