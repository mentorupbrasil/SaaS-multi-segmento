"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleEventTaskDone } from "@/modules/events/actions";
import { formatDate } from "@/lib/utils";

export function EventTaskList({
  tasks,
}: {
  tasks: Array<{
    id: string;
    title: string;
    dueAt: Date | null;
    done: boolean;
  }>;
}) {
  const [pending, start] = useTransition();
  const router = useRouter();

  if (tasks.length === 0) {
    return <p className="text-sm text-slate-500">Nenhuma tarefa cadastrada.</p>;
  }

  return (
    <ul className="divide-y divide-slate-100">
      {tasks.map((task) => (
        <li key={task.id} className="flex items-center gap-3 px-4 py-3 text-sm">
          <input
            type="checkbox"
            checked={task.done}
            disabled={pending}
            className="h-4 w-4 rounded border-slate-300"
            onChange={() =>
              start(async () => {
                await toggleEventTaskDone(task.id, !task.done);
                router.refresh();
              })
            }
          />
          <div className="flex-1">
            <p className={task.done ? "text-slate-400 line-through" : "font-medium text-slate-900"}>
              {task.title}
            </p>
            {task.dueAt && (
              <p className="text-xs text-slate-500">Prazo: {formatDate(task.dueAt)}</p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
