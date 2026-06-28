import { headers } from "next/headers";
import { requireModule } from "@/lib/require-module";

export default async function AppTemplate({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  if (pathname) {
    await requireModule(pathname);
  }
  return <>{children}</>;
}
