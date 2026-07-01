import { headers } from "next/headers";

/** Pathname da rota atual (header definido no middleware — sem cookie, evita bypass). */
export async function getRequestPathname(): Promise<string | null> {
  const h = await headers();
  const fromHeader = h.get("x-pathname");
  if (fromHeader) return fromHeader;

  const url = h.get("x-url");
  if (url) {
    try {
      return new URL(url).pathname;
    } catch {
      /* ignore */
    }
  }

  return null;
}
