import type { Course } from '@/modules/course/domain/Course';

type TeacherCoursesCardProps = {
  courses: Course[];
};

export function TeacherCoursesCard({ courses }: TeacherCoursesCardProps) {
  if (courses.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-(--border) p-6">
        <h3 className="font-extrabold text-(--fg) mb-2">Mis cursos</h3>
        <p className="text-sm text-(--fg-muted)">No tienes cursos asignados.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-(--border) p-6">
      <h3 className="font-extrabold text-(--fg) mb-4">Mis cursos</h3>
      <div className="flex flex-col gap-2">
        {courses.map((course) => (
          <div key={course.id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-(--tint-50)">
            <div className="size-10 rounded-xl bg-emerald-100 text-emerald-700 grid place-items-center font-extrabold text-sm shrink-0">
              {course.shortname?.slice(0, 2).toUpperCase() || course.fullname.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-extrabold text-sm text-(--fg) truncate">{course.fullname}</div>
              {course.shortname && (
                <div className="text-[10px] font-bold text-(--fg-subtle)">{course.shortname}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
