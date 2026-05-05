import { useCallback, useMemo, useState } from 'react';

export interface MonthCursor {
  year: number;
  month: number;
}

const addMonths = (year: number, month: number, delta: number): MonthCursor => {
  const date = new Date(year, month - 1, 1);
  date.setMonth(date.getMonth() + delta);
  return { year: date.getFullYear(), month: date.getMonth() + 1 };
};

export function useMonthCursor() {
  const today = useMemo(() => new Date(), []);

  const [cursor, setCursor] = useState<MonthCursor>(() => ({
    year: today.getFullYear(),
    month: today.getMonth() + 1,
  }));

  const goPrevMonth = useCallback(() => setCursor((c) => addMonths(c.year, c.month, -1)), []);
  const goNextMonth = useCallback(() => setCursor((c) => addMonths(c.year, c.month, 1)), []);

  return { cursor, goPrevMonth, goNextMonth };
}
