import { useCallback, useMemo, useState } from "react";

export interface MonthCursor {
  year: number;
  month: number;
  day: number;
}

export function useMonthCursor(): {
  cursor: MonthCursor;
  goPrevMonth: () => void;
  goNextMonth: () => void;
} {
  const today = useMemo(() => new Date(), []);

  const [cursor, setCursor] = useState<MonthCursor>(() => ({
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: today.getDate(),
  }));

  const goPrevMonth = useCallback(() => {
    setCursor((c) => {
      const d = new Date(c.year, c.month - 1, 1);
      d.setMonth(d.getMonth() - 1);
      return { year: d.getFullYear(), month: d.getMonth() + 1, day: 1 };
    });
  }, []);

  const goNextMonth = useCallback(() => {
    setCursor((c) => {
      const d = new Date(c.year, c.month - 1, 1);
      d.setMonth(d.getMonth() + 1);
      return { year: d.getFullYear(), month: d.getMonth() + 1, day: 1 };
    });
  }, []);

  return { cursor, goPrevMonth, goNextMonth };
}