import { notFound } from "next/navigation";
import { isFeatureEnabled } from "@/lib/feature-flags";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  if (!isFeatureEnabled("PORTAL")) {
    notFound();
  }
  return children;
}
