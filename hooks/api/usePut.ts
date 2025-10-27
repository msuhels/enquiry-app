export function usePut<T = any>() {
  const put = async (url: string, body?: any): Promise<T> => {
    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw new Error(`PUT ${url} failed: ${res.statusText}`);
    return res.json();
  };
  return { put };
}
