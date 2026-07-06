import Calendar from '@/components/calendar/Calendar';
import { Page } from '@/components/ui/page/Page';
import type { CalendarViewModel } from '@/components/calendar/calendar.types';
import type { CalendarEvent } from '@/modules/calendar/domain/CalendarEvent';
import { UpcomingEventsPanel } from '../components/UpcomingEventsPanel';

type ScheduleViewProps = {
  viewModel: CalendarViewModel | null;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  upcomingEvents: CalendarEvent[];
  upcomingLoading: boolean;
  onUpcomingEventClick: (event: CalendarEvent) => void;
};

const ScheduleView = ({
  viewModel,
  onPrevMonth,
  onNextMonth,
  upcomingEvents,
  upcomingLoading,
  onUpcomingEventClick,
}: ScheduleViewProps) => {
  return (
    <Page title="Horario">
      <div className="grid grid-cols-[1fr_320px] gap-6">
        <div className="flex flex-col gap-4">
          {viewModel ? (
            <Calendar viewModel={viewModel} onPrev={onPrevMonth} onNext={onNextMonth} />
          ) : (
            <div className="h-96 animate-pulse rounded-2xl bg-white/60" />
          )}
        </div>

        <div className="flex flex-col gap-4">
          <UpcomingEventsPanel
            events={upcomingEvents}
            loading={upcomingLoading}
            onEventClick={onUpcomingEventClick}
          />
        </div>
      </div>
    </Page>
  );
};

export default ScheduleView;
