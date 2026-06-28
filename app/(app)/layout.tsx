import { redirect } from "next/navigation";
import { getOptionalAuthContext } from "@/lib/auth-context";
import { getSegment } from "@/segments";
import { buildNav } from "@/lib/nav";
import { Sidebar } from "@/components/sidebar";
import { auth } from "@/auth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ctx = await getOptionalAuthContext();
  if (!ctx) redirect("/login");

  const session = await auth();
  const segment = getSegment(ctx.organization.segmentId);
  const navItems = buildNav(ctx.organization);

  return (
    <div className="flex">
      <Sidebar
        orgName={ctx.organization.name}
        segmentLabel={segment?.label ?? "Negócio"}
        segmentIcon={segment?.icon ?? "Building2"}
        userName={session?.user?.name ?? session?.user?.email ?? ""}
        navItems={navItems}
        isPlatformAdmin={session?.user?.isPlatformAdmin}
      />
      <main className="h-screen flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
