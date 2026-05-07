import { ChevronRight } from 'lucide-react';

import type { Course } from '@/modules/course/domain/Course';

import { CalendarWidget } from '@/features/calendar/CalendarWidget';
import { RecentlyAccessedPanel } from '@/features/recently-accessed/RecentlyAccessedPanel';

import DashCourseCard from '../components/DashCourseCard';

type DashboardViewProps = {
  user: CurrentUser | null;
  courses: Course[];
  onNavigateToCourses: () => void;
  onCourseClick: (courseId: number) => void;
};

const DashboardView = ({ user, courses, onNavigateToCourses, onCourseClick }: DashboardViewProps) => {
  return (
    <div className="flex flex-1 overflow-hidden">
      <main className="flex-1 overflow-y-auto px-8 pt-5 pb-8">
        <div className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
          <div className="absolute -top-16 -right-10 size-64 rounded-full bg-emerald-500 opacity-30 blur-3xl" />

          <div className="relative grid grid-cols-[1fr_auto] items-center gap-6">
            <div>
              <div className="mb-1 text-xs font-bold uppercase tracking-wider text-(--fg-subtle)">
                ¡Hola, {user?.firstName ?? 'estudiante'}!
              </div>

              <h1 className="mb-2 text-2xl font-extrabold leading-tight text-(--fg)">¿Qué aprendemos hoy?</h1>

              <p className="text-sm font-bold text-(--fg-muted)">
                {courses.length} {courses.length === 1 ? 'curso activo' : 'cursos activos'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="min-w-20 rounded-2xl bg-white px-4 py-3 text-center">
                <div className="text-2xl">🏅</div>

                <div className="mt-1 text-lg font-extrabold leading-none text-(--fg)">—</div>

                <div className="mt-0.5 text-[10px] font-bold uppercase text-(--fg-subtle)">Insignias</div>
              </div>

              <div className="min-w-20 rounded-2xl bg-white px-4 py-3 text-center">
                <div className="text-2xl">📈</div>

                <div className="mt-1 text-lg font-extrabold leading-none text-(--fg)">—</div>

                <div className="mt-0.5 text-[10px] font-bold uppercase text-(--fg-subtle)">Puesto</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-[1fr_320px] gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-(--fg)">Mis cursos</h2>

              <button
                type="button"
                onClick={onNavigateToCourses}
                className="flex items-center gap-1 text-sm font-bold text-emerald-700 hover:text-emerald-800"
              >
                Ver todos
                <ChevronRight className="size-4" />
              </button>
            </div>

            {courses.length === 0 ? (
              <p className="text-sm text-(--fg-subtle)">No tienes cursos activos.</p>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {courses.map((course, index) => (
                  <DashCourseCard
                    key={course.id}
                    course={course}
                    index={index}
                    onClick={() => onCourseClick(course.id)}
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

export default DashboardView;
