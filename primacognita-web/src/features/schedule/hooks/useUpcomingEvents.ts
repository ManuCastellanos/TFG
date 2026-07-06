import { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useDependencies } from '@/shared/providers/DependenciesProvider';
import { queryKeys } from '@/shared/hooks/queryKeys';
import { useTimeNow } from '@/shared/hooks/useTimeNow';
import type { CalendarEvent } from '@/modules/calendar/domain/CalendarEvent';
import type { MonthCursor } from '@/shared/hooks/useMonthCursor';

const DEFAULT_LIMIT = 8;
const INTERNAL_MODULES = ['assign', 'quiz', 'forum'];

const nextMonthCursor = (cursor: MonthCursor): MonthCursor => {
  const next = new Date(cursor.year, cursor.month, 1);
  return { year: next.getFullYear(), month: next.getMonth() + 1 };
};

const extractCmid = (url: string | null): number | null => {
  const match = url?.match(/[?&]id=(\d+)/);
  return match ? Number(match[1]) : null;
};

type UseUpcomingEventsResult = {
  events: CalendarEvent[];
  isLoading: boolean;
  handleEventClick: (event: CalendarEvent) => void;
};

export function useUpcomingEvents(
  token: string | null,
  cursor: MonthCursor,
  limit: number = DEFAULT_LIMIT,
): UseUpcomingEventsResult {
  const { calendarRepository } = useDependencies();
  const navigate = useNavigate();
  const now = useTimeNow();
  const next = useMemo(() => nextMonthCursor(cursor), [cursor]);

  const currentQuery = useQuery({
    queryKey: queryKeys.calendar.month(cursor.year, cursor.month),
    queryFn: () => calendarRepository.getCalendar(token!, cursor),
    enabled: !!token,
    staleTime: 60 * 1000,
  });

  const nextQuery = useQuery({
    queryKey: queryKeys.calendar.month(next.year, next.month),
    queryFn: () => calendarRepository.getCalendar(token!, next),
    enabled: !!token,
    staleTime: 60 * 1000,
  });

  const events = useMemo(() => {
    const calendars = [currentQuery.data, nextQuery.data].filter((c) => !!c);
    const nowSeconds = now / 1000;

    return calendars
      .flatMap((calendar) => calendar.weeks.flatMap((week) => week.days.flatMap((day) => day.events)))
      .filter((event) => event.timestart >= nowSeconds)
      .sort((a, b) => a.timestart - b.timestart)
      .slice(0, limit);
  }, [currentQuery.data, nextQuery.data, now, limit]);

  const handleEventClick = useCallback(
    (event: CalendarEvent) => {
      const cmid = extractCmid(event.url ?? event.viewUrl);

      if (event.courseId && cmid && event.moduleName && INTERNAL_MODULES.includes(event.moduleName)) {
        const courseId = String(event.courseId);
        if (event.moduleName === 'assign') {
          void navigate({ to: '/courses/$courseId/assignment/$cmid', params: { courseId, cmid: String(cmid) } });
          return;
        }
        if (event.moduleName === 'quiz') {
          void navigate({ to: '/courses/$courseId/quiz/$quizId', params: { courseId, quizId: String(cmid) } });
          return;
        }
        if (event.moduleName === 'forum') {
          void navigate({ to: '/courses/$courseId/forum/$cmid', params: { courseId, cmid: String(cmid) } });
          return;
        }
      }

      if (event.courseId) {
        void navigate({ to: '/courses/$id', params: { id: String(event.courseId) } });
      }
    },
    [navigate],
  );

  return { events, isLoading: currentQuery.isLoading || nextQuery.isLoading, handleEventClick };
}
