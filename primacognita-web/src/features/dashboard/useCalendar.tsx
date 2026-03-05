import { useCallback, useEffect, useState } from "react";
import type { Calendar } from "@/modules/calendar/domain/Calendar";
import { useDependencies } from "@/shared/providers/DependenciesProvider";

type UseCalendarResult = {
  calendar: Calendar | null;
  isFetching: boolean; // 👈 en vez de loading “bloqueante”
  error: string | null;
  refetch: () => Promise<void>;
};

export const useCalendar = (
  token: string | null,
  params: { year: number; month: number; day?: number },
): UseCalendarResult => {
  const { calendarRepository } = useDependencies();

  const [calendar, setCalendar] = useState<Calendar | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCalendar = useCallback(async () => {
    if (!token) {
      setCalendar(null);
      setError(null);
      setIsFetching(false);
      return;
    }

    setIsFetching(true);
    setError(null);

    try {
      const data = await calendarRepository.getCalendar(token, params);
      setCalendar(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setIsFetching(false);
    }
  }, [calendarRepository, token, params.year, params.month, params.day]);

  useEffect(() => {
    void fetchCalendar();
  }, [fetchCalendar]);

  return { calendar, isFetching, error, refetch: fetchCalendar };
};