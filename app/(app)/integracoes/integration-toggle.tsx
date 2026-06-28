"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleIntegrationAction } from "./actions";

export function IntegrationToggle({
  provider,
  enabled,
}: {
  provider: "whatsapp" | "pix" | "google_calendar";
  enabled: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleToggle() {
    const formData = new FormData();
    formData.set("provider", provider);
    formData.set("enabled", enabled ? "false" : "true");

    startTransition(async () => {
      await toggleIntegrationAction({}, formData);
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={pending}
      className={`relative h-7 w-12 shrink-0 rounded-full transition ${
        enabled ? "bg-brand-600" : "bg-slate-200"
      } ${pending ? "opacity-60" : ""}`}
      aria-pressed={enabled}
      aria-label={enabled ? "Desativar integração" : "Ativar integração"}
    >
      <span
        className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${
          enabled ? "left-5" : "left-0.5"
        }`}
      />
    </button>
  );
}
