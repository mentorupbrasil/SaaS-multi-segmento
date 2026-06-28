"use client";

import { useState } from "react";
import { Icon } from "@/components/icon";

export function PortalShareLink({ url, label = "Link do portal" }: { url: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      const full = `${window.location.origin}${url}`;
      await navigator.clipboard.writeText(full);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <button type="button" onClick={copy} className="btn-secondary inline-flex items-center gap-2 text-sm">
      <Icon name="Link" className="h-4 w-4" />
      {copied ? "Copiado!" : label}
    </button>
  );
}
