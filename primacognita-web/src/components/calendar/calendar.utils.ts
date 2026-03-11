import type { Calendar } from "@/modules/calendar/domain/Calendar";
import type { CalendarCell, CalendarViewModel } from "./calendar.types";

const isWeekendDay = (timestampSeconds: number): boolean => {
  const day = new Date(timestampSeconds * 1000).getDay();
  return day === 0 || day === 6;
};

const getMonthLabelEs = (year: number, month: number): string =>
  new Date(year, month - 1, 1).toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });

const daysInMonth = (year: number, month: number): number =>
  new Date(year, month, 0).getDate();

const buildCells = (
  calendar: Calendar,
  year: number,
  month: number,
): CalendarCell[] => {
  const cells: CalendarCell[] = [];

  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const prevDaysCount = daysInMonth(prevYear, prevMonth);

  let postDayCounter = 1;

  calendar.weeks.forEach((week, weekIndex) => {
    const prePaddingTotal = week.prepadding.length;

    week.prepadding.forEach((_, i) => {
      const dayOfMonth = prevDaysCount - (prePaddingTotal - 1 - i);

      cells.push({
        kind: "ghost",
        key: `pre-${weekIndex}-${i}`,
        dayOfMonth,
      });
    });

    week.days.forEach((day) => {
      const events = day.events.map((e) => ({
        id: e.id,
        name: e.name,
        timestart: e.timestart,
        descriptionHtml: e.descriptionHtml,
        url: e.url,
        viewUrl: e.viewUrl,
        courseName: e.courseName,
        eventType: e.eventType,
        isOverdue: e.isOverdue,
      }));

      cells.push({
        kind: "day",
        key: String(day.timestamp),
        dayOfMonth: day.mday,
        isToday: day.isToday,
        timestamp: day.timestamp,
        isWeekend: isWeekendDay(day.timestamp),
        events,
        hasEvents: events.length > 0,
        hasOverdue: events.some((e) => e.isOverdue),
      });
    });

    week.postpadding.forEach((_, i) => {
      cells.push({
        kind: "ghost",
        key: `post-${weekIndex}-${i}`,
        dayOfMonth: postDayCounter++,
      });
    });
  });

  return cells;
};

export const buildCalendarMiniViewModel = (
  calendar: Calendar,
  year: number,
  month: number,
  isFetching?: boolean,
): CalendarViewModel => ({
  title: calendar.periodName ?? getMonthLabelEs(year, month),
  cells: buildCells(calendar, year, month),
  isFetching,
});

export const buildCalendarTwoWeeksViewModel = (
  calendar: Calendar,
  year: number,
  month: number,
  weekOffset: number,
  isFetching?: boolean,
): CalendarViewModel => {
  const allCells = buildCells(calendar, year, month);
  const start = weekOffset * 7;
  const cells = allCells.slice(start, start + 14);

  return {
    title: calendar.periodName ?? getMonthLabelEs(year, month),
    cells,
    isFetching,
  };
};
