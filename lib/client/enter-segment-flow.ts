"use client";

import { switchSegmentAction } from "@/app/admin/actions";
import { clearStuckOverlays } from "@/lib/clear-stuck-overlays";

export async function enterSegmentFlow(segmentId: string): Promise<{ error?: string; ok?: boolean }> {
  const result = await switchSegmentAction(segmentId);
  clearStuckOverlays();
  if (result && "error" in result && result.error) {
    return { error: result.error };
  }
  return { ok: true };
}
