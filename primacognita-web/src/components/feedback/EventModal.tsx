// EventsModal.tsx
import { useEffect } from "react";
import type { CalendarCell } from "@/components/data-display/calendar/calendar.types";
import { cn } from "@/shared/utils/cn";

type DayCell = Extract<CalendarCell, { kind: "day" }>;

type Props = {
  cell: DayCell;
  onClose: () => void;
};

export default function EventsModal({ cell, onClose }: Props) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);

    // lock scroll while modal open
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const dateLabel = new Date(cell.timestamp * 1000).toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="fixed inset-0 z-50">
      {/* overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* dialog */}
      <div className="absolute inset-0 grid place-items-center p-4">
        <div
          className={cn(
            `
            w-full max-w-md
            rounded-2xl
            bg-(--surface)
            border border-(--border)
            shadow-2xl
            transition-colors
            `,
          )}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="events-modal-title"
        >
          {/* header */}
          <div className="flex items-start justify-between gap-3 border-b border-(--border) px-5 py-4">
            <div className="min-w-0">
              <div id="events-modal-title" className="truncate text-sm font-semibold">
                {dateLabel}
              </div>
              <div className="mt-1 text-xs text-(--muted)">
                {cell.events.length} evento(s)
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-2 py-1 text-(--muted) hover:bg-(--bg) hover:text-(--fg)"
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>

          {/* body */}
          <div className="max-h-[60vh] overflow-auto px-5 py-4">
            <div className="space-y-3">
              {cell.events.map((e) => (
                <div key={e.id} className="rounded-xl border border-(--border) p-3">
                  <div className="font-medium truncate">{e.name}</div>

                  {e.courseName && (
                    <div className="mt-1 text-xs text-(--muted) truncate">
                      {e.courseName}
                    </div>
                  )}

                  {/* time */}
                  <div className="mt-2 text-xs text-(--muted)">
                    {new Date(e.timestart * 1000).toLocaleString("es-ES", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>

                  {/* actions */}
                  <div className="mt-3 flex flex-wrap gap-3">
                    {e.url && (
                      <a
                        className="text-sm font-medium text-(--color-pr) hover:underline"
                        href={e.url}
                      >
                        Go to activity
                      </a>
                    )}
                    {e.viewUrl && (
                      <a
                        className="text-sm text-(--muted) hover:underline"
                        href={e.viewUrl}
                      >
                        Ver en calendario
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* footer (optional) */}
          <div className="border-t border-(--border) px-5 py-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl border border-(--border) bg-(--bg) px-4 py-2 text-sm font-semibold hover:bg-(--surface)"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}