export function usePatch<T = any>() {
  const patch = async (url: string, body?: any): Promise<T> => {
    const res = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw new Error(`PATCH ${url} failed: ${res.statusText}`);
    return res.json();
  };
  return { patch };
}
