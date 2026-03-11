import type { CalendarCell } from "@/components/calendar/calendar.types";

type DayCell = Extract<CalendarCell, { kind: "day" }>;

export default function EventsTooltip({ cell }: { cell: DayCell }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 w-72 rounded-xl border border-(--border) bg-(--surface) p-3 shadow-xl">
      <div className="text-sm font-semibold">
        {new Date(cell.timestamp * 1000).toLocaleDateString("es-ES", {
          weekday: "long",
          day: "numeric",
          month: "long",
        })}
      </div>

      <ul className="mt-2 space-y-1 text-sm">
        {cell.events.slice(0, 4).map((e) => (
          <li key={e.id} className="truncate">
            {e.name}
          </li>
        ))}
        {cell.events.length > 4 && (
          <li className="text-xs text-(--muted)">+{cell.events.length - 4} más…</li>
        )}
      </ul>
    </div>
  );
}