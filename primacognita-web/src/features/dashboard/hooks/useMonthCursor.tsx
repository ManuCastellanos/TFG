import { useCallback, useMemo, useState } from "react";

export interface MonthCursor {
  year: number;
  month: number;
  day: number;
  weekOffset: number;
}

const getWeeksInMonthGrid = (year: number, month: number): number => {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);

  const firstWeekday = (firstDay.getDay() + 6) % 7;
  const totalDays = lastDay.getDate();

  return Math.ceil((firstWeekday + totalDays) / 7);
};

const addMonths = (
  year: number,
  month: number,
  delta: number,
): { year: number; month: number } => {
  const date = new Date(year, month - 1, 1);
  date.setMonth(date.getMonth() + delta);

  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
  };
};

export function useMonthCursor(): {
  cursor: MonthCursor;
  goPrevMonth: () => void;
  goNextMonth: () => void;
  goPrevTwoWeeks: () => void;
  goNextTwoWeeks: () => void;
} {
  const today = useMemo(() => new Date(), []);

  const [cursor, setCursor] = useState<MonthCursor>(() => ({
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: today.getDate(),
    weekOffset: 0,
  }));

  const goPrevMonth = useCallback(() => {
    setCursor((current) => {
      const prev = addMonths(current.year, current.month, -1);
      return {
        year: prev.year,
        month: prev.month,
        day: 1,
        weekOffset: 0,
      };
    });
  }, []);

  const goNextMonth = useCallback(() => {
    setCursor((current) => {
      const next = addMonths(current.year, current.month, 1);
      return {
        year: next.year,
        month: next.month,
        day: 1,
        weekOffset: 0,
      };
    });
  }, []);

  const goPrevTwoWeeks = useCallback(() => {
    setCursor((current) => {
      if (current.weekOffset >= 2) {
        return {
          ...current,
          weekOffset: current.weekOffset - 2,
        };
      }

      const prev = addMonths(current.year, current.month, -1);
      const prevWeeks = getWeeksInMonthGrid(prev.year, prev.month);

      return {
        year: prev.year,
        month: prev.month,
        day: 1,
        weekOffset: Math.max(0, prevWeeks - 2),
      };
    });
  }, []);

  const goNextTwoWeeks = useCallback(() => {
    setCursor((current) => {
      const weeksInCurrentMonth = getWeeksInMonthGrid(
        current.year,
        current.month,
      );

      if (current.weekOffset + 2 < weeksInCurrentMonth) {
        return {
          ...current,
          weekOffset: current.weekOffset + 2,
        };
      }

      const next = addMonths(current.year, current.month, 1);

      return {
        year: next.year,
        month: next.month,
        day: 1,
        weekOffset: 0,
      };
    });
  }, []);

  return {
    cursor,
    goPrevMonth,
    goNextMonth,
    goPrevTwoWeeks,
    goNextTwoWeeks,
  };
}
