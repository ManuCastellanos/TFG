import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDependencies } from '@/shared/providers/DependenciesProvider';
import { buildCalendarMiniViewModel } from '@/components/calendar/calendar.utils';
import { queryKeys } from './queryKeys';
import type { CalendarViewModel } from '@/components/calendar/calendar.types';
import type { MonthCursor } from './useMonthCursor';

type UseCalendarResult = {
  viewModel: CalendarViewModel | null;
  error: string | null;
  isLoading: boolean;
  reload: () => void;
};

export function useCalendar(token: string | null, cursor: MonthCursor): UseCalendarResult {
  const { calendarRepository } = useDependencies();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.calendar.month(cursor.year, cursor.month),
    queryFn: () => calendarRepository.getCalendar(token!, cursor),
    enabled: !!token,
    staleTime: 60 * 1000,
  });

  const viewModel = useMemo(
    () => (data ? buildCalendarMiniViewModel(data, cursor.year, cursor.month, isLoading) : null),
    [data, cursor.year, cursor.month, isLoading],
  );

  return { viewModel, error: error?.message ?? null, isLoading, reload: refetch };
}
