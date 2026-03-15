import { useMemo } from "react";
import { useMonthCursor } from "./useMonthCursor";
import { useCalendar } from "./useCalendar";
import { useUserCourses } from "./useUserCourses";
import { useSession } from "@/shared/hooks/useSession";
import { useCurrentUser } from "./useUser";
import type { CalendarEventVm } from "@/components/calendar/calendar.types";
import type { ScheduleEntry } from "../components/schedule/schedule.types";

const SCHEDULE_COLORS = [
  "bg-orange-500",
  "bg-violet-500",
  "bg-blue-500",
  "bg-amber-500",
  "bg-teal-500",
] as const;

const toScheduleEntry = (event: CalendarEventVm, i: number): ScheduleEntry => ({
  id: event.id,
  code: (event.courseName ?? event.name).slice(0, 2).toUpperCase(),
  accentColor: SCHEDULE_COLORS[i % SCHEDULE_COLORS.length],
  title: event.name,
  time: new Date(event.timestart * 1000).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  }),
  subtitle: event.courseName ?? "",
});

export type UseDashboardResult = {
  user: ReturnType<typeof useCurrentUser>["user"];
  courses: ReturnType<typeof useUserCourses>["courses"];
  coursesLoading: boolean;
  coursesError: string | null;
  scheduleItems: ScheduleEntry[];
  calendarViewModel: ReturnType<typeof useCalendar>["viewModel"];
  calendarLoading: boolean;
  goPrevCalendar: () => void;
  goNextCalendar: () => void;
};

export function useDashboard(): UseDashboardResult {
  const { userId, token } = useSession();
  const { user } = useCurrentUser();

  const { courses, loading: coursesLoading, error: coursesError } =
    useUserCourses(userId, token);

  const { cursor, goPrevMonth, goNextMonth } = useMonthCursor();
  const { viewModel: calendarViewModel, isLoading: calendarLoading } =
    useCalendar(token, cursor);

  const scheduleItems = useMemo<ScheduleEntry[]>(() => {
    if (!calendarViewModel) return [];
    const todayCell = calendarViewModel.cells.find(
      (c) => c.kind === "day" && c.isToday,
    );
    if (!todayCell || todayCell.kind !== "day") return [];
    return todayCell.events.map(toScheduleEntry);
  }, [calendarViewModel]);

  return {
    user,
    courses,
    coursesLoading,
    coursesError,
    scheduleItems,
    calendarViewModel,
    calendarLoading,
    goPrevCalendar: goPrevMonth,
    goNextCalendar: goNextMonth,
  };
}