import { requirePlatformAdmin } from "@/lib/platform-admin";
import { listOrganizationsForSwitcher, getAuthContext } from "@/lib/auth-context";
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
    <div className="flex min-h-screen bg-background">
      <AdminSidebar
        userName={session.user?.name ?? session.user?.email ?? ""}
        organizations={organizations}
        activeOrgId={ctx.orgId}
        segments={segments}
        activeSegmentId={ctx.effectiveSegmentId}
      />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</div>
      </main>
    </div>
  );
}
