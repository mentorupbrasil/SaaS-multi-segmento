import { redirect } from "next/navigation";
import { getOptionalAuthContext, listOrganizationsForSwitcher } from "@/lib/auth-context";
import { getSegment } from "@/segments";
import { buildNavForUser } from "@/lib/nav";
import { Sidebar } from "@/components/sidebar";
import { auth } from "@/auth";
import { isPlatformAdminEmail } from "@/lib/platform-admin";
import { listSegmentsForSwitcher } from "@/lib/segment-switcher-data";

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

  const segment = getSegment(ctx.effectiveSegmentId);
  const navItems = buildNavForUser(
    { ...ctx.organization, segmentId: ctx.effectiveSegmentId },
    isPlatformAdmin,
  );
  const organizations = isPlatformAdmin ? await listOrganizationsForSwitcher() : [];
  const segments = isPlatformAdmin ? listSegmentsForSwitcher() : [];

  return (
    <div className="flex">
      <Sidebar
        orgName={ctx.organization.name}
        segmentLabel={
          isPlatformAdmin
            ? `${segment?.label ?? "Segmento"} · super admin`
            : (segment?.label ?? "Negócio")
        }
        segmentIcon={segment?.icon ?? "Building2"}
        userName={session?.user?.name ?? session?.user?.email ?? ""}
        navItems={navItems}
        isPlatformAdmin={isPlatformAdmin}
        organizations={organizations}
        activeOrgId={ctx.orgId}
        segments={segments}
        activeSegmentId={ctx.effectiveSegmentId}
      />
      <main className="h-screen flex-1 overflow-y-auto">
        {ctx.isSegmentPreview && segment && (
          <div className="border-b border-amber-200 bg-amber-50 px-6 py-2.5 text-sm text-amber-900">
            Modo preview: interface de <strong>{segment.label}</strong>. Dados da organização ativa.
            Use o seletor <strong>Sistema / segmento</strong> no menu para trocar.
          </div>
        )}
        <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
