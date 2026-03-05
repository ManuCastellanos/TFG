import Calendar from "@/components/ui/calendar/Calendar";
import { useEventsCalendar } from "./hooks/useEventsCalendar";
import type { CalendarViewModel } from "@/components/ui/calendar/calendar.types";
import EventsModal from "@/components/ui/EventModal";
import EventsTooltip from "@/components/ui/EventsToolTip";

export function CalendarWidget({ viewModel, onPrev, onNext }: {
  viewModel: CalendarViewModel;
  onPrev: () => void;
  onNext: () => void;
}) {
  const ui = useEventsCalendar(viewModel.cells);

  return (
    <>
      <Calendar
        viewModel={viewModel}
        onPrev={onPrev}
        onNext={onNext}
        onDayHover={ui.onHover}
        onDayClick={(ts) => ui.onSelect(ts)}
      />

      {ui.hoveredCell?.kind === "day" && (
        <EventsTooltip cell={ui.hoveredCell} />
      )}

      {ui.selectedCell?.kind === "day" && (
        <EventsModal cell={ui.selectedCell} onClose={() => ui.onSelect(null)} />
      )}
    </>
  );
}
