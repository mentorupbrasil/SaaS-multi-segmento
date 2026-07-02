"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { clearStuckOverlays } from "@/lib/clear-stuck-overlays";

/** Fecha overlays Radix órfãos ao trocar de rota (menu mobile, etc.). */
export function RouteChangeCleanup() {
  const pathname = usePathname();

  useEffect(() => {
    clearStuckOverlays();
  }, [pathname]);

  return null;
}
