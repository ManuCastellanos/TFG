import Calendar from "@/components/calendar/Calendar";
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
  if (!viewModel) {
    return (
      <div className="h-40 animate-pulse rounded-2xl bg-white/60" />
    );
  }

  return (
    <Calendar
      viewModel={viewModel}
      onPrev={onPrev}
      onNext={onNext}
      onDayHover={onDayHover}
      onDayClick={onDayClick}
    />
  );
};