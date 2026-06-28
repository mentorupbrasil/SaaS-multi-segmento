"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { moveAppointmentToDay } from "@/modules/scheduling/actions";

export interface CalendarAppointment {
  id: string;
  label: string;
  sublabel?: string;
}

export interface CalendarDayColumn {
  dateIso: string;
  label: string;
  dayNumber: string;
  isToday: boolean;
  appointments: CalendarAppointment[];
}

export function CalendarDragGrid({ days }: { days: CalendarDayColumn[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleDrop(appointmentId: string, targetDateIso: string) {
    startTransition(async () => {
      await moveAppointmentToDay(appointmentId, targetDateIso);
      router.refresh();
    });
  }

  return (
    <div className={`grid grid-cols-1 gap-3 sm:grid-cols-7 ${pending ? "opacity-70" : ""}`}>
      {days.map((day) => (
        <div
          key={day.dateIso}
          className={`card min-h-[160px] p-3 ${day.isToday ? "ring-2 ring-brand-500" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            e.currentTarget.classList.add("ring-2", "ring-brand-300");
          }}
          onDragLeave={(e) => {
            e.currentTarget.classList.remove("ring-2", "ring-brand-300");
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.currentTarget.classList.remove("ring-2", "ring-brand-300");
            const id = e.dataTransfer.getData("text/appointment-id");
            if (id) handleDrop(id, day.dateIso);
          }}
        >
          <p className="mb-2 text-xs font-semibold uppercase text-slate-500">{day.label}</p>
          <p className={`mb-3 text-lg font-bold ${day.isToday ? "text-brand-600" : "text-slate-900"}`}>
            {day.dayNumber}
          </p>

          {day.appointments.length === 0 ? (
            <p className="text-xs text-slate-400">Arraste agendamentos aqui</p>
          ) : (
            <ul className="space-y-2">
              {day.appointments.map((a) => (
                <li key={a.id}>
                  <div
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("text/appointment-id", a.id);
                      e.dataTransfer.effectAllowed = "move";
                    }}
                    className="cursor-grab rounded-lg bg-slate-50 px-2 py-1.5 text-xs active:cursor-grabbing hover:bg-brand-50"
                    title="Arraste para outro dia"
                  >
                    <p className="font-medium text-slate-900">{a.label}</p>
                    {a.sublabel && <p className="truncate text-slate-500">{a.sublabel}</p>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
