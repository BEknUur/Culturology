import { useAuth } from "@clerk/clerk-react";

export const useApi = () => {
  const { getToken } = useAuth();

  return async <T>(path: string): Promise<T> => {
    // если путь начинается с /mock — читаем локальный файл
    const url = path.startsWith("/mock")
      ? path
      : import.meta.env.VITE_API_URL + path;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${await getToken().catch(() => "")}`,
      },
    });

    if (!res.ok) throw new Error(await res.text());
    return res.json();
  };
};
