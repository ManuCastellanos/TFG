import { useMemo } from "react";
import { useMonthCursor } from "./useMonthCursor";
import { useCalendar } from "./useCalendar";
import { useUserCourses } from "../../courses/hooks/useUserCourses";
import { useRecentlyAccessedItems } from "./useRecentlyAccessedItems";
import { useSession } from "@/shared/hooks/useSession";
import { useCurrentUser } from "./useUser";
import type { CalendarEventVm } from "@/components/calendar/calendar.types";
import type { ScheduleEntry } from "../components/schedule/schedule.types";
import type { RecentItem } from "@/modules/recentlyAccessed/domain/RecentItem";

const SCHEDULE_COLORS = [
  "bg-orange-500",
  "bg-violet-500",
  "bg-blue-500",
  "bg-amber-500",
  "bg-teal-500",
] as const;

const MOD_COLORS: Record<string, string> = {
  resource: "bg-blue-500",
  quiz: "bg-orange-500",
  assign: "bg-violet-500",
  forum: "bg-teal-500",
  page: "bg-amber-500",
  url: "bg-green-500",
};

const toRecentEntry = (item: RecentItem, i: number): ScheduleEntry => ({
  id: item.id,
  code: item.modName.slice(0, 2).toUpperCase(),
  accentColor: MOD_COLORS[item.modName] ?? SCHEDULE_COLORS[i % SCHEDULE_COLORS.length],
  title: item.name,
  time: new Date(item.timeAccess * 1000).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
  }),
  subtitle: item.courseName,
  viewUrl: item.viewUrl || null,
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

  const { items: recentItems } = useRecentlyAccessedItems(token);

  const scheduleItems = useMemo<ScheduleEntry[]>(
    () => recentItems.map(toRecentEntry),
    [recentItems],
  );

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
