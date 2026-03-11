import Calendar from "@/components/calendar/Calendar";
import { Surface } from "@/components/surface/Surface";
import type { CalendarViewModel } from "@/components/calendar/calendar.types";

export type CalendarWidgetProps = {
  viewModel: CalendarViewModel | null;
  onPrev: () => void;
  onNext: () => void;
  onDayHover?: (ts: number | null) => void;
  onDayClick?: (ts: number) => void;
};

export const CalendarWidget = ({
  viewModel,
  onPrev,
  onNext,
  onDayHover,
  onDayClick,
}: CalendarWidgetProps) => {
  if (!viewModel) return <Surface className="h-48 animate-pulse" />;

  return (
    <Surface>
      <Calendar
        viewModel={viewModel}
        onPrev={onPrev}
        onNext={onNext}
        onDayHover={onDayHover}
        onDayClick={onDayClick}
      />
    </Surface>
  );
};