import { useUserCourses } from "./hooks/useUserCourses";
import { useMonthCursor } from "./hooks/useMonthCursor";
import { useDashboardCalendar } from "./hooks/useDashboardCalendar";
import { CalendarWidget } from "@/features/dashboard/CalendarWidget";
import { useSession } from "@/shared/hooks/useSession";


export default function Dashboard() {
  const { userId, token } = useSession();

  const { cursor, goPrevMonth, goNextMonth } = useMonthCursor();
  const { viewModel, error: errorCalendar } = useDashboardCalendar(token, cursor);
  
  const { courses, categoryNameById, loading: loadingCourses, error: errorCourses } =
    useUserCourses(userId, token);


  return (
    <div className="h-screen bg-(--bg) p-6 text-(--fg)">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_260px]">
        <div>
          {loadingCourses && <p className="text-(--muted)">Cargando cursos...</p>}
          {errorCourses && <p className="text-red-660">Error: {errorCourses}</p>}

          {!loadingCourses && !errorCourses && (
            <ul className="mt-4 space-y-3">
              {courses.map((c) => (
                <li key={c.id} className="rounded-xl border border-(--border) bg-(--surface) p-4 shadow-sm">
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

        <div className="lg:justify-self-end">
             {errorCalendar && <p className="text-red-600">Error: {errorCalendar}</p>}
       
             {viewModel && (
               <CalendarWidget
                   viewModel={viewModel}
                   onPrev={goPrevMonth}
                   onNext={goNextMonth}
               />
             )}
           </div>
      </div>
    </div>
  );
}