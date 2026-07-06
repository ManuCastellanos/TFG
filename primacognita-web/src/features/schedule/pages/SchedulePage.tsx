import { useMemo } from 'react';
import { useSession } from '@/shared/hooks/useSession';
import { useMonthCursor, type MonthCursor } from '@/shared/hooks/useMonthCursor';
import { useCalendar } from '@/shared/hooks/useCalendar';
import { useUpcomingEvents } from '../hooks/useUpcomingEvents';
import ScheduleView from './ScheduleView';

const SchedulePage = () => {
  const { token } = useSession();
  const { cursor, goPrevMonth, goNextMonth } = useMonthCursor();
  const { viewModel } = useCalendar(token, cursor);

  const todayCursor = useMemo((): MonthCursor => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() + 1 };
  }, []);
  const { events, isLoading, handleEventClick } = useUpcomingEvents(token, todayCursor);

  return (
    <ScheduleView
      viewModel={viewModel}
      onPrevMonth={goPrevMonth}
      onNextMonth={goNextMonth}
      upcomingEvents={events}
      upcomingLoading={isLoading}
      onUpcomingEventClick={handleEventClick}
    />
  );
};

export default SchedulePage;
