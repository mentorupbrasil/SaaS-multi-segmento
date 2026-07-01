import { getAuthContext } from "@/lib/auth-context";
import { getRequestPathname } from "@/lib/request-pathname";
import { requireModule } from "@/lib/require-module";
import { requireActiveSubscription } from "@/lib/subscription";
import { PageTransition } from "@/components/motion/page-transition";

export default async function AppTemplate({ children }: { children: React.ReactNode }) {
  const pathname = await getRequestPathname();
  const ctx = await getAuthContext();
  requireActiveSubscription(ctx, pathname);
  if (pathname) {
    await requireModule(pathname);
  }
  return <PageTransition>{children}</PageTransition>;
}
