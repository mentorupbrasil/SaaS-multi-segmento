"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { switchSegmentAction } from "@/app/admin/actions";

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
      className="btn-primary text-sm"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          await switchSegmentAction(segmentId);
          router.push("/dashboard");
          router.refresh();
        });
      }}
    >
      {pending ? "Abrindo..." : label}
    </button>
  );
}
