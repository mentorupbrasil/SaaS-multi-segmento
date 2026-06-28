import { redirect } from "next/navigation";
import { getOptionalAuthContext, listOrganizationsForSwitcher } from "@/lib/auth-context";
import { getSegment } from "@/segments";
import { buildNavForUser } from "@/lib/nav";
import { Sidebar } from "@/components/sidebar";
import { auth } from "@/auth";
import { isPlatformAdminEmail } from "@/lib/platform-admin";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ctx = await getOptionalAuthContext();
  if (!ctx) redirect("/login");

  const session = await auth();
  const isPlatformAdmin =
    ctx.isPlatformAdmin ?? session?.user?.isPlatformAdmin ?? isPlatformAdminEmail(session?.user?.email);

  const segment = getSegment(ctx.organization.segmentId);
  const navItems = buildNavForUser(ctx.organization, isPlatformAdmin);
  const organizations = isPlatformAdmin ? await listOrganizationsForSwitcher() : [];

  return (
    <div className="flex">
      <Sidebar
        orgName={ctx.organization.name}
        segmentLabel={isPlatformAdmin ? "Super admin · todos os módulos" : (segment?.label ?? "Negócio")}
        segmentIcon={isPlatformAdmin ? "Server" : (segment?.icon ?? "Building2")}
        userName={session?.user?.name ?? session?.user?.email ?? ""}
        navItems={navItems}
        isPlatformAdmin={isPlatformAdmin}
        organizations={organizations}
        activeOrgId={ctx.orgId}
      />
      <main className="h-screen flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
