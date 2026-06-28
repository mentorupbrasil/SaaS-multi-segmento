import { auth } from "@/auth";
import { redirect } from "next/navigation";

/** E-mails com acesso ao painel /admin (separados por vírgula no .env). */
export function isPlatformAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const list =
    process.env.PLATFORM_ADMIN_EMAILS?.split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean) ?? [];
  return list.includes(email.toLowerCase());
}

export async function requirePlatformAdmin() {
  const session = await auth();
  if (!session?.user?.email || !isPlatformAdminEmail(session.user.email)) {
    redirect("/dashboard");
  }
  return session;
}
