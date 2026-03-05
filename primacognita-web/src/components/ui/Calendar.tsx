import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import Button from "@/components/ui/Button";
import type { Calendar } from "@/modules/calendar/domain/Calendar";

type Props = {
  calendar: Calendar;
  year: number;
  month: number;
  onPrev: () => void;
  onNext: () => void;
  isFetching?: boolean;
};

const DOW = ["L", "M", "X", "J", "V", "S", "D"] as const;

type Cell =
  | { kind: "empty"; key: string }
  | { kind: "day"; key: string; mday: number; isToday: boolean; timestamp: number };

const joinClassNames = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");

const isWeekendDay = (timestampSeconds: number) => {
  const dayOfWeek = new Date(timestampSeconds * 1000).getDay(); // 0 dom, 6 sáb
  return dayOfWeek === 0 || dayOfWeek === 6;
};

const getMonthLabelEs = (year: number, month: number) => {
  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString("es-ES", { month: "long", year: "numeric" });
};

const buildCalendarCells = (calendar: Calendar): Cell[] => {
  const cells: Cell[] = [];

  calendar.weeks.forEach((week, weekIndex) => {
    week.prepadding.forEach((_, i) => {
      cells.push({ kind: "empty", key: `pre-${weekIndex}-${i}` });
    });

    week.days.forEach((day) => {
      cells.push({
        kind: "day",
        key: String(day.timestamp),
        mday: day.mday,
        isToday: day.isToday,
        timestamp: day.timestamp,
      });
    });

    week.postpadding.forEach((_, i) => {
      cells.push({ kind: "empty", key: `post-${weekIndex}-${i}` });
    });
  });

  return cells;
};

export default function CalendarMini({
  calendar,
  year,
  month,
  onPrev,
  onNext,
  isFetching,
}: Props) {
  const title = useMemo(() => calendar.periodName ?? getMonthLabelEs(year, month), [
    calendar.periodName,
    month,
    year,
  ]);

  const cells = useMemo(() => buildCalendarCells(calendar), [calendar]);

  return (
    <div className="w-65 rounded-xl border border-(--border) bg-(--surface) p-4 text-(--fg)">
      <CalendarHeader
        title={title}
        isFetching={isFetching}
        onPrev={onPrev}
        onNext={onNext}
      />

      <DayOfWeekRow />

      <CalendarGrid cells={cells} />
    </div>
  );
}

type CalendarHeaderProps = {
  title: string;
  isFetching?: boolean;
  onPrev: () => void;
  onNext: () => void;
};

const CalendarHeader = ({ title, isFetching, onPrev, onNext }: CalendarHeaderProps) => {
  return (
    <div className="flex items-center justify-between gap-2">
      <Button
        variant="ghost"
        type="button"
        onClick={onPrev}
        disabled={isFetching}
        aria-label="Mes anterior"
      >
        <ChevronLeft className="size-5 text-(--color-pr)" />
      </Button>

      <div className="min-w-0 flex-1 text-center text-sm font-semibold">
        <span className={joinClassNames("truncate", isFetching && "opacity-70")}>{title}</span>
      </div>

      <Button
        variant="ghost"
        type="button"
        onClick={onNext}
        disabled={isFetching}
        aria-label="Mes siguiente"
      >
        <ChevronRight className="size-5 text-(--color-pr)" />
      </Button>
    </div>
  );
};

const DayOfWeekRow = () => {
  return (
    <div className="mt-3 grid grid-cols-7 text-center text-[11px] font-semibold text-(--muted)">
      {DOW.map((day) => (
        <div key={day} className="py-1">
          {day}
        </div>
      ))}
    </div>
  );
};

type CalendarGridProps = {
  cells: Cell[];
};

const CalendarGrid = ({ cells }: CalendarGridProps) => {
  return (
    <div className="mt-1 grid grid-cols-7 gap-y-1 text-center">
      {cells.map((cell) => (
        <CalendarCell key={cell.key} cell={cell} />
      ))}
    </div>
  );
};

type CalendarCellProps = {
  cell: Cell;
};

const CalendarCell = ({ cell }: CalendarCellProps) => {
  if (cell.kind === "empty") return <div className="h-8" />;

  const weekend = isWeekendDay(cell.timestamp);

  return (
    <div className="flex h-8 items-center justify-center">
      <div
        className={joinClassNames(
          "relative flex size-7 items-center justify-center rounded-full text-xs transition",
          cell.isToday ? "bg-(--color-pr) text-white" : "text-(--fg) hover:bg-(--bg)",
        )}
      >
        {weekend && !cell.isToday && (
          <>
            <span className="pointer-events-none absolute inset-0 rounded-full bg-red-500/20 blur-[2px]" />
            <span className="pointer-events-none absolute inset-0 rounded-full bg-red-500/10" />
          </>
        )}
        <span className="relative">{cell.mday}</span>
      </div>
    </div>
  );
};