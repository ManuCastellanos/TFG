import { SkelBox, SkelLine } from '@/components/ui/skeleton';
import { formatDueDate } from '@/features/course-workspace/sections/student/task/utils/formatDueDate';
import { useTimeNow } from '@/shared/hooks/useTimeNow';
import type { CalendarEvent } from '@/modules/calendar/domain/CalendarEvent';

type Props = {
  events: CalendarEvent[];
  loading: boolean;
  onEventClick: (event: CalendarEvent) => void;
};

export function UpcomingEventsPanel({ events, loading, onEventClick }: Props) {
  const now = useTimeNow();

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-5 border border-(--border)">
        <SkelLine w={140} h={14} className="mb-3" />
        <div className="flex flex-col gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-2xl border border-(--border)">
              <SkelBox w={40} h={40} r={12} />
              <div className="flex-1 flex flex-col gap-1.5">
                <SkelLine w={`${55 + i * 10}%`} h={12} />
                <SkelLine w="35%" h={9} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-5 border border-(--border)">
      <h3 className="font-semibold text-(--fg) mb-3">Próximos eventos</h3>

      {events.length === 0 ? (
        <p className="text-sm text-(--fg-subtle)">No hay eventos próximos.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {events.map((event) => {
            const clickable = event.courseId != null;

            return (
              <button
                key={event.id}
                type="button"
                disabled={!clickable}
                onClick={() => onEventClick(event)}
                className="flex items-start gap-3 p-3 rounded-2xl border border-(--border) text-left enabled:hover:bg-(--tint-50) disabled:cursor-default"
              >
                <div className="size-10 rounded-xl grid place-items-center text-lg shrink-0 bg-(--tint-50)">
                  🗓️
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-(--fg) truncate">{event.name}</div>
                  {event.courseName && (
                    <div className="text-xs text-(--fg-muted) truncate">{event.courseName}</div>
                  )}
                  <div className="text-xs font-bold mt-0.5 text-(--fg-muted)">
                    {formatDueDate(event.timestart, now)}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
