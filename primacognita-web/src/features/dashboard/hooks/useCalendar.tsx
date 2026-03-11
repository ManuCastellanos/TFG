import { useCallback, useEffect, useMemo, useState } from "react";
import {
  buildCalendarMiniViewModel,
  buildCalendarTwoWeeksViewModel,
} from "@/components/calendar/calendar.utils";
import type { Calendar } from "@/modules/calendar/domain/Calendar";
import { useDependencies } from "@/shared/providers/DependenciesProvider";
import type { CalendarViewModel } from "@/components/calendar/calendar.types";
import type { MonthCursor } from "./useMonthCursor";

type CalendarMode = "full" | "twoWeeks";

type UseCalendarResult = {
  viewModel: CalendarViewModel | null;
  error: string | null;
  isLoading: boolean;
  reload: () => Promise<void>;
};

export function useCalendar(
  token: string | null,
  cursor: MonthCursor,
  mode: CalendarMode = "full",
): UseCalendarResult {
  const { calendarRepository } = useDependencies();
  const [calendar, setCalendar] = useState<Calendar | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const reload = useCallback(async () => {
    if (!token) {
      setCalendar(null);
      setError(null);
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const result = await calendarRepository.getCalendar(token, cursor);
      setCalendar(result);
    } catch {
      setError("No se pudo cargar el calendario");
      setCalendar(null);
    } finally {
      setIsLoading(false);
    }
  }, [calendarRepository, cursor, token]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const viewModel = useMemo(() => {
    if (!calendar) return null;
    const builder =
      mode === "twoWeeks"
        ? buildCalendarTwoWeeksViewModel
        : buildCalendarMiniViewModel;
    return builder(calendar, cursor.year, cursor.month, isLoading);
  }, [calendar, cursor.month, cursor.year, isLoading, mode]);

  return { viewModel, error, isLoading, reload };
}