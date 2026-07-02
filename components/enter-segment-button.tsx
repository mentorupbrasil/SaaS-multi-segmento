"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { enterSegmentFlow } from "@/lib/client/enter-segment-flow";

export function EnterSegmentButton({
  segmentId,
  label = "Ver no sistema",
}: {
  segmentId: string;
  label?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className="btn-primary inline-flex items-center gap-2 text-sm"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          const result = await enterSegmentFlow(segmentId);
          if (result.error) return;
          router.push("/dashboard");
          router.refresh();
        });
      }}
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Abrindo...
        </>
      ) : (
        label
      )}
    </button>
  );
}
