import { requirePlatformAdmin } from "@/lib/platform-admin";
import { listOrganizationsForSwitcher, getAuthContext } from "@/lib/auth-context";
import { buildSuperAdminNav } from "@/lib/nav";
import { listSegmentsForSwitcher } from "@/lib/segment-switcher-data";
import { AdminSidebar } from "@/components/admin-sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requirePlatformAdmin();
  const [organizations, ctx, segments] = await Promise.all([
    listOrganizationsForSwitcher(),
    getAuthContext(),
    Promise.resolve(listSegmentsForSwitcher()),
  ]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar
        userName={session.user?.name ?? session.user?.email ?? ""}
        organizations={organizations}
        activeOrgId={ctx.orgId}
        segments={segments}
        activeSegmentId={ctx.effectiveSegmentId}
        operationalNav={buildSuperAdminNav()}
      />
      <main className="h-screen flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
