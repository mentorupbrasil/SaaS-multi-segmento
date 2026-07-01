import { redirect } from "next/navigation";
import { getOptionalAuthContext, listOrganizationsForSwitcher } from "@/lib/auth-context";
import { getSegment } from "@/segments";
import { buildNavForUser } from "@/lib/nav";
import { requireActiveSubscription, isSubscriptionActive } from "@/lib/subscription";
import { getRequestPathname } from "@/lib/request-pathname";
import { Sidebar } from "@/components/sidebar";
import { MobileAppHeader } from "@/components/mobile-app-header";
import { PlanUsageBanner } from "@/components/plan-usage-banner";
import { auth } from "@/auth";
import { isPlatformAdminEmail } from "@/lib/platform-admin";
import { listSegmentsForSwitcher } from "@/lib/segment-switcher-data";

function isOnboardingCompleted(config: unknown): boolean {
  if (!config || (typeof config === "object" && Object.keys(config as object).length === 0)) {
    return true;
  }
  if (config && typeof config === "object" && "onboardingCompleted" in config) {
    return (config as { onboardingCompleted?: boolean }).onboardingCompleted === true;
  }
  return false;
}

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ctx = await getOptionalAuthContext();
  if (!ctx) redirect("/login");

  const pathname = await getRequestPathname();
  requireActiveSubscription(ctx, pathname);

  const session = await auth();
  const isPlatformAdmin =
    ctx.isPlatformAdmin ?? session?.user?.isPlatformAdmin ?? isPlatformAdminEmail(session?.user?.email);

  if (
    !isPlatformAdmin &&
    isSubscriptionActive(ctx.organization) &&
    !isOnboardingCompleted(ctx.organization.config) &&
    pathname !== "/onboarding"
  ) {
    redirect("/onboarding");
  }

  const segment = getSegment(ctx.effectiveSegmentId);
  const subscriptionActive = isSubscriptionActive(ctx.organization);
  const allNavItems = buildNavForUser(
    { ...ctx.organization, segmentId: ctx.effectiveSegmentId, plan: ctx.organization.plan },
    isPlatformAdmin,
  );
  const navItems = subscriptionActive
    ? allNavItems
    : allNavItems.filter(
        (item) => item.href === "/assinatura" || item.href.startsWith("/configuracoes"),
      );
  const organizations = isPlatformAdmin ? await listOrganizationsForSwitcher() : [];
  const segments = isPlatformAdmin ? listSegmentsForSwitcher() : [];

  const sidebarProps = {
    orgName: ctx.organization.name,
    segmentLabel: isPlatformAdmin
      ? `${segment?.label ?? "Segmento"} · super admin`
      : (segment?.label ?? "Negócio"),
    segmentIcon: segment?.icon ?? "Building2",
    userName: session?.user?.name ?? session?.user?.email ?? "",
    navItems,
    subscriptionActive,
    isPlatformAdmin,
    organizations,
    activeOrgId: ctx.orgId,
    segments,
    activeSegmentId: ctx.effectiveSegmentId,
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar {...sidebarProps} />
      <div className="flex min-h-screen flex-1 flex-col">
        <MobileAppHeader {...sidebarProps} />
        <main className="flex-1 overflow-y-auto">
          {ctx.isSegmentPreview && segment && (
            <div className="border-b border-amber-200/80 bg-amber-50 px-6 py-2.5 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200">
              Modo preview: interface de <strong>{segment.label}</strong>. Dados da organização ativa.
              Use o seletor <strong>Sistema / segmento</strong> no menu para trocar.
            </div>
          )}
          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
            {subscriptionActive && <PlanUsageBanner orgId={ctx.orgId} />}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
