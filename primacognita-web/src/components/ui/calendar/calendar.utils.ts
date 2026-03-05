import type { Calendar } from "@/modules/calendar/domain/Calendar";
import type { CalendarCell, CalendarViewModel } from "./calendar.types";

const isWeekendDay = (timestampSeconds: number): boolean => {
  const dayOfWeek = new Date(timestampSeconds * 1000).getDay();
  return dayOfWeek === 0 || dayOfWeek === 6;
};

const getMonthLabelEs = (year: number, month: number): string => {
  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString("es-ES", { month: "long", year: "numeric" });
};

const buildCells = (calendar: Calendar): CalendarCell[] => {
  const cells: CalendarCell[] = [];

  calendar.weeks.forEach((week, weekIndex) => {
    week.prepadding.forEach((_, i) => {
      cells.push({ kind: "empty", key: `pre-${weekIndex}-${i}` });
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
      cells.push({ kind: "empty", key: `post-${weekIndex}-${i}` });
    });
  });

  return cells;
};

export const buildCalendarMiniViewModel = (
  calendar: Calendar,
  year: number,
  month: number,
  isFetching?: boolean,
): CalendarViewModel => {
  return {
    title: calendar.periodName ?? getMonthLabelEs(year, month),
    cells: buildCells(calendar),
    isFetching,
  };
};
