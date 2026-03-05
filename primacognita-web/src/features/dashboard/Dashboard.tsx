import { useMemo, useState } from "react";
import AuthStorage from "@/modules/login/infrastructure/AuthStorage";
import { useCalendar } from "@/features/dashboard/useCalendar";
import { useUserCourses } from "./useUserCourses";
import Calendar from "@/components/ui/Calendar";

export default function Dashboard() {
  const session = AuthStorage.get();

  const userId = session?.userId ?? null;
  const token = session?.token ?? null;

  const {
    courses,
    categoryNameById,
    loading: loadingCourses,
    error: errorCourses,
  } = useUserCourses(userId, token);

  const today = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState(() => ({
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: today.getDate(),
  }));

  const {
    calendar,
    isFetching: isFetchingCalendar,
    error: errorCalendar,
  } = useCalendar(token, cursor);

  const onPrev = () => {
    setCursor((c) => {
      const d = new Date(c.year, c.month - 1, 1);
      d.setMonth(d.getMonth() - 1);
      return { year: d.getFullYear(), month: d.getMonth() + 1, day: 1 };
    });
  };

  const onNext = () => {
    setCursor((c) => {
      const d = new Date(c.year, c.month - 1, 1);
      d.setMonth(d.getMonth() + 1);
      return { year: d.getFullYear(), month: d.getMonth() + 1, day: 1 };
    });
  };

  return (
    <div className="min-h-screen bg-(--bg) p-6 text-(--fg)">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_260px]">
        {/* LEFT: Courses */}
        <div>
          {loadingCourses && <p className="text-(--muted)">Cargando cursos...</p>}
          {errorCourses && <p className="text-red-600">Error: {errorCourses}</p>}

          {!loadingCourses && !errorCourses && (
            <ul className="mt-4 space-y-3">
              {courses.map((c) => (
                <li
                  key={c.id}
                  className="rounded-xl border border-(--border) bg-(--surface) p-4 shadow-sm"
                >
                  <div className="font-medium">{c.fullname}</div>

                  <div className="mt-1 text-sm text-(--muted)">
                    {categoryNameById[c.categoryId ?? ""] ?? c.categoryId}
                  </div>

                  {c.imageUrl && (
                    <img
                      className="mt-3 h-32 w-full rounded-lg object-cover"
                      src={c.imageUrl}
                      alt={c.fullname}
                    />
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* RIGHT: Calendar */}
        <div className="lg:justify-self-end">
          {errorCalendar && <p className="text-red-600">Error: {errorCalendar}</p>}

          {calendar && (
            <Calendar
              calendar={calendar}
              onPrev={onPrev}
              onNext={onNext}
              isFetching={isFetchingCalendar}
            />
          )}
        </div>
      </div>
    </div>
  );
}