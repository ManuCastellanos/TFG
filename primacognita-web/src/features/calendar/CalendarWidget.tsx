import Calendar from '@/components/calendar/Calendar';
import { useSession } from '@/shared/hooks/useSession';
import { useMonthCursor } from '@/shared/hooks/useMonthCursor';
import { useCalendar } from '@/shared/hooks/useCalendar';

export function CalendarWidget() {
  const { token } = useSession();
  const { cursor, goPrevMonth, goNextMonth } = useMonthCursor();
  const { viewModel } = useCalendar(token, cursor);

  if (!viewModel) {
    return <div className="h-40 animate-pulse rounded-2xl bg-white/60" />;
  }

  return <Calendar viewModel={viewModel} onPrev={goPrevMonth} onNext={goNextMonth} />;
}
