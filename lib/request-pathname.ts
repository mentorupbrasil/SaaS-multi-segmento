import { headers, cookies } from "next/headers";

/** Pathname da rota atual (middleware + cookie de fallback). */
export async function getRequestPathname(): Promise<string> {
  const h = await headers();
  const fromHeader = h.get("x-pathname");
  if (fromHeader) return fromHeader;

  const c = await cookies();
  return c.get("gp-path")?.value ?? "";
}
