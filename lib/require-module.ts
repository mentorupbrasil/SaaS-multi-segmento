import { redirect } from "next/navigation";
import { getAuthContext } from "@/lib/auth-context";
import { checkModuleAccess } from "@/lib/route-modules";

export { checkModuleAccess, getModuleForPath } from "@/lib/route-modules";

/** Bloqueia rota se o módulo não está ativo no segmento. */
export async function requireModule(pathname: string) {
  const ctx = await getAuthContext();
  if (!checkModuleAccess(pathname, ctx.effectiveSegmentId)) {
    redirect("/dashboard");
  }
}
