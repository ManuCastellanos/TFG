import { cn } from "@/shared/utils/cn";
import type { CalendarEventVm } from "./calendar.types";

interface Props {
  timestamp: number;
  events: CalendarEventVm[];
}

export function EventPopover({ timestamp, events }: Props) {
  const dayLabel = new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(timestamp * 1000));

  return (
    <div className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 w-60 -translate-x-1/2">
      {/* piquito */}
      <div className="absolute -top-1.5 left-1/2 size-3 -translate-x-1/2 rotate-45 border-l border-t border-(--border) bg-white" />

      <div className="rounded-xl border border-(--border) bg-white p-3 shadow-lg">
        <p className="mb-2 text-xs font-bold capitalize text-(--fg)">
          {dayLabel} · {events.length} {events.length === 1 ? "evento" : "eventos"}
        </p>
        <ul className="space-y-1">
          {events.map((ev) => (
            <li
              key={ev.id}
              className={cn(
                "text-xs leading-snug",
                ev.isOverdue ? "text-red-500" : "text-(--fg-muted)",
              )}
            >
              {ev.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
