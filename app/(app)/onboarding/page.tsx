import { redirect } from "next/navigation";
import { getAuthContext } from "@/lib/auth-context";
import { getSegment } from "@/segments";
import { PageHeader } from "@/components/page-header";
import { OnboardingWizard } from "./onboarding-wizard";

function isOnboardingCompleted(config: unknown): boolean {
  if (config && typeof config === "object" && "onboardingCompleted" in config) {
    return (config as { onboardingCompleted?: boolean }).onboardingCompleted === true;
  }
  return false;
}

export default async function OnboardingPage() {
  const ctx = await getAuthContext();
  const org = ctx.organization;

  if (isOnboardingCompleted(org.config)) {
    redirect("/dashboard");
  }

  const segment = getSegment(org.segmentId);

  return (
    <div>
      <PageHeader
        title="Configuração inicial"
        description="Configure seu negócio em poucos passos."
      />
      <OnboardingWizard orgName={org.name} segmentLabel={segment?.label ?? org.segmentId} />
    </div>
  );
}
