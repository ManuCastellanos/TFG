import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDependencies } from '@/shared/providers/DependenciesProvider';
import { buildCalendarMiniViewModel } from '@/components/calendar/calendar.utils';
import type { Calendar } from '@/modules/calendar/domain/Calendar';
import type { CalendarViewModel } from '@/components/calendar/calendar.types';
import type { MonthCursor } from './useMonthCursor';

type UseCalendarResult = {
  viewModel: CalendarViewModel | null;
  error: string | null;
  isLoading: boolean;
  reload: () => Promise<void>;
};

export function useCalendar(token: string | null, cursor: MonthCursor): UseCalendarResult {
  const { calendarRepository } = useDependencies();
  const [calendar, setCalendar] = useState<Calendar | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const reload = useCallback(async () => {
    if (!token) {
      setCalendar(null);
      setError(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      setCalendar(await calendarRepository.getCalendar(token, cursor));
    } catch {
      setError('No se pudo cargar el calendario');
      setCalendar(null);
    } finally {
      setIsLoading(false);
    }
  }, [calendarRepository, cursor, token]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const viewModel = useMemo(
    () => (calendar ? buildCalendarMiniViewModel(calendar, cursor.year, cursor.month, isLoading) : null),
    [calendar, cursor.year, cursor.month, isLoading],
  );

  return { viewModel, error, isLoading, reload };
}
