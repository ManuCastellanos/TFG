import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button/Button";
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
          aria-label="Mes anterior"
        >
          <ChevronLeft className={c.chevron} />
        </Button>

        <div className={c.headerTitle}>
          <span
            className={cn(
              c.title,
              viewModel.isFetching ? c.titleFetching : c.titleText,
            )}
          >
            {viewModel.title}
          </span>
        </div>

        <Button
          variant="ghost"
          type="button"
          onClick={onNext}
          disabled={viewModel.isFetching}
          aria-label="Mes siguiente"
        >
          <ChevronRight className={c.chevron} />
        </Button>
      </div>

      <div className={c.dowRow}>
        {DOW_LABELS.map((d) => (
          <div key={d} className={c.dowCell}>
            {d}
          </div>
        ))}
      </div>

      <div className={c.grid}>
        {viewModel.cells.map((cell) => {
          if (cell.kind === "empty") {
            return <div key={cell.key} className={c.emptyCell} />;
          }

          if (cell.kind === "ghost") {
            return (
              <div key={cell.key} className={c.cell}>
                <div className={cn(c.dayBase, c.dayGhost)}>
                  <span className={c.dayText}>{cell.dayOfMonth}</span>
                </div>
              </div>
            );
          }

          if (!cell.hasEvents) {
            return (
              <div key={cell.key} className={c.cell}>
                <div className={cn(c.dayBase, cell.isToday ? c.dayToday : c.dayNormal)}>
                  <span className={c.dayText}>{cell.dayOfMonth}</span>
                </div>
              </div>
            );
          }

          return (
            <div key={cell.key} className={c.cell}>
              <div
                className={cn(
                  c.dayBase,
                  cell.isToday ? c.dayToday : c.dayNormal,
                  cell.hasOverdue && c.dayHasOverdue,
                  c.dayHasEvents,
                )}
                onMouseEnter={() => onDayHover?.(cell.timestamp)}
                onMouseLeave={() => onDayHover?.(null)}
                onClick={() => onDayClick?.(cell.timestamp)}
                onKeyDown={(e) =>
                  (e.key === 'Enter' || e.key === ' ') && onDayClick?.(cell.timestamp)
                }
                role="button"
                tabIndex={0}
              >
                <span className={c.dayText}>{cell.dayOfMonth}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
