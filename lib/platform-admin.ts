import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { isPlatformAdminEmail } from "./platform-admin-emails";

export { isPlatformAdminEmail } from "./platform-admin-emails";

export async function requirePlatformAdmin() {
  const session = await auth();
  if (!session?.user?.email || !isPlatformAdminEmail(session.user.email)) {
    redirect("/dashboard");
  }
  return session;
}
