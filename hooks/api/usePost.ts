export function usePost<T = any>() {
  const post = async (url: string, body?: any): Promise<T> => {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw new Error(`POST ${url} failed: ${res.statusText}`);
    return res.json();
  };
  return { post };
}
