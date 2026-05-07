import { useNavigate } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';
import { useUserCourses } from '@/shared/hooks/useUserCourses';
import { useSession } from '@/shared/hooks/useSession';
import { useCurrentUser } from '@/shared/hooks/useCurrentUser';
import { CalendarWidget } from '@/features/calendar/CalendarWidget';
import { RecentlyAccessedPanel } from '@/features/recently-accessed/RecentlyAccessedPanel';
import DashCourseCard from './components/DashCourseCard';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { userId, token } = useSession();
  const { user } = useCurrentUser();
  const { courses } = useUserCourses(userId, token);

  return (
    <div className="flex flex-1 overflow-hidden">
      <main className="flex-1 overflow-y-auto px-8 pt-5 pb-8">
        <div className="relative overflow-hidden rounded-3xl p-6 border border-emerald-200 bg-emerald-50">
          <div className="absolute -top-16 -right-10 size-64 rounded-full opacity-30 blur-3xl bg-emerald-500" />
          <div className="relative grid grid-cols-[1fr_auto] gap-6 items-center">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-(--fg-subtle) mb-1">
                ¡Hola, {user?.firstName ?? 'estudiante'}!
              </div>
              <h1 className="text-2xl font-extrabold text-(--fg) leading-tight mb-2">¿Qué aprendemos hoy?</h1>
              <p className="text-sm font-bold text-(--fg-muted)">
                {courses.length} {courses.length === 1 ? 'curso activo' : 'cursos activos'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-2xl px-4 py-3 text-center min-w-20">
                <div className="text-2xl">🏅</div>
                <div className="text-lg font-extrabold text-(--fg) leading-none mt-1">—</div>
                <div className="text-[10px] text-(--fg-subtle) font-bold uppercase mt-0.5">Insignias</div>
              </div>
              <div className="bg-white rounded-2xl px-4 py-3 text-center min-w-20">
                <div className="text-2xl">📈</div>
                <div className="text-lg font-extrabold text-(--fg) leading-none mt-1">—</div>
                <div className="text-[10px] text-(--fg-subtle) font-bold uppercase mt-0.5">Puesto</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_320px] gap-6 mt-6">
          {/* Left: Courses */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-extrabold text-(--fg) text-xl">Mis cursos</h2>
              <button
                type="button"
                onClick={() => navigate({ to: '/courses' })}
                className="flex items-center gap-1 text-sm font-bold text-emerald-700 hover:text-emerald-800"
              >
                Ver todos <ChevronRight className="size-4" />
              </button>
            </div>

            {courses.length === 0 ? (
              <p className="text-sm text-(--fg-subtle)">No tienes cursos activos.</p>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {courses.map((course, i) => (
                  <DashCourseCard
                    key={course.id}
                    course={course}
                    index={i}
                    onClick={() => navigate({ to: '/courses/$id', params: { id: course.id } })}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <CalendarWidget />
            <RecentlyAccessedPanel />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
