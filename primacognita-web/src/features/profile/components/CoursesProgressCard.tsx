import { InlineProgressBar } from '@/components/ui/progressBar/ProgressBar';
import type { Course } from '@/modules/course/domain/Course';

type CoursesProgressCardProps = {
  courses: Course[];
};

const COLOR_CYCLE = [
  { soft: 'bg-sky-100',    text: 'text-sky-700',    grad: 'from-sky-400 to-sky-500' },
  { soft: 'bg-violet-100', text: 'text-violet-700', grad: 'from-violet-400 to-violet-500' },
  { soft: 'bg-lime-100',   text: 'text-lime-700',   grad: 'from-lime-400 to-lime-500' },
  { soft: 'bg-orange-100', text: 'text-orange-700', grad: 'from-orange-400 to-orange-500' },
];

export function CoursesProgressCard({ courses }: CoursesProgressCardProps) {
  if (courses.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-(--border) p-6">
        <h3 className="font-extrabold text-(--fg) mb-2">Mi progreso por curso</h3>
        <p className="text-sm text-(--fg-muted)">No hay cursos matriculados.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-(--border) p-6">
      <h3 className="font-extrabold text-(--fg) mb-4">Mi progreso por curso</h3>
      <div className="flex flex-col gap-3">
        {courses.map((course, i) => {
          const cm = COLOR_CYCLE[i % COLOR_CYCLE.length];
          const progress = course.progress ?? 0;
          const abbr = course.shortname?.slice(0, 2).toUpperCase() || course.fullname.slice(0, 2).toUpperCase();
          return (
            <div key={course.id} className="flex items-center gap-4">
              <div className={`size-10 rounded-xl ${cm.soft} ${cm.text} grid place-items-center font-extrabold text-sm shrink-0`}>
                {abbr}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="font-extrabold text-sm text-(--fg) truncate">{course.fullname}</span>
                  <span className="text-xs font-extrabold text-(--fg-muted) ml-2 shrink-0">{Math.round(progress)}%</span>
                </div>
                <InlineProgressBar value={progress} colorClass={cm.grad} height="h-2" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
