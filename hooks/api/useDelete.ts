export function useDelete<T = any>() {
  const del = async (url: string): Promise<T> => {
    const res = await fetch(url, { method: "DELETE" });
    if (!res.ok) throw new Error(`DELETE ${url} failed: ${res.statusText}`);
    return res.json();
  };
  return { del };
}
