import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/components/button/Button";
import { cn } from "@/shared/utils/cn";
import { calendarClasses as c } from "./calendar.styles";
import type { CalendarViewModel } from "./calendar.types";

interface Props {
  viewModel: CalendarViewModel;
  onPrev: () => void;
  onNext: () => void;
  onDayHover?: (ts: number | null) => void;
  onDayClick?: (ts: number) => void;
}

const DOW_LABELS = ["L", "M", "X", "J", "V", "S", "D"] as const;

export default function Calendar({
  viewModel,
  onPrev,
  onNext,
  onDayHover,
  onDayClick,
}: Props) {
  return (
    <div className={c.root}>
      <div className={c.header}>
        <Button
          variant="ghost"
          type="button"
          onClick={onPrev}
          disabled={viewModel.isFetching}
          aria-label="Semana anterior"
        >
          <ChevronLeft className={c.chevron} />
        </Button>

        <span
          className={cn(
            c.title,
            viewModel.isFetching ? c.titleFetching : c.titleText,
          )}
        >
          {viewModel.title}
        </span>

        <Button
          variant="ghost"
          type="button"
          onClick={onNext}
          disabled={viewModel.isFetching}
          aria-label="Semana siguiente"
        >
          <ChevronRight className={c.chevron} />
        </Button>
      </div>

      {/* ── Day-of-week labels ── */}
      <div className={c.dowRow}>
        {DOW_LABELS.map((d) => (
          <div key={d} className={c.dowCell}>
            {d}
          </div>
        ))}
      </div>

      {/* ── Day grid ── */}
      <div className={c.grid}>
        {viewModel.cells.map((cell) => {
          if (cell.kind === "empty") {
            return <div key={cell.key} className={c.emptyCell} />;
          }

          return (
            <div key={cell.key} className={c.cell}>
              <div
                className={cn(
                  c.dayBase,
                  cell.isToday ? c.dayToday : c.dayNormal,
                  cell.hasOverdue && c.dayHasOverdue,
                  !cell.hasOverdue && cell.hasEvents && c.dayHasEvents,
                )}
                onMouseEnter={() =>
                  cell.hasEvents && onDayHover?.(cell.timestamp)
                }
                onMouseLeave={() => onDayHover?.(null)}
                onClick={() => cell.hasEvents && onDayClick?.(cell.timestamp)}
                role={cell.hasEvents ? "button" : undefined}
                tabIndex={cell.hasEvents ? 0 : -1}
              >
                {cell.isWeekend && !cell.isToday && (
                  <span className={c.weekendBlur1} />
                )}
                <span className={c.dayText}>{cell.dayOfMonth}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
