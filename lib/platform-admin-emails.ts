/** Edge-safe: sem imports de auth/prisma. Usado pelo middleware. */
export function isPlatformAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const list =
    process.env.PLATFORM_ADMIN_EMAILS?.split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean) ?? [];
  return list.includes(email.toLowerCase());
}
