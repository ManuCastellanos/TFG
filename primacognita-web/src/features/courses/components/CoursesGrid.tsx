import { Plus } from 'lucide-react';
import CourseLibCard from './CourseLibCard';
import type { Course } from '@/modules/course/domain/Course';

type CoursesGridProps = {
  loading: boolean;
  courses: Course[];
  isTeacher: boolean;
  onCourseClick: (id: string) => void;
  onCreateCourse: () => void;
};

const CoursesGrid = ({ loading, courses, isTeacher, onCourseClick, onCreateCourse }: CoursesGridProps) => {
  if (loading) {
    return <p className="text-sm text-(--fg-muted)">Cargando cursos…</p>;
  }

  if (courses.length === 0) {
    return <p className="text-sm text-(--fg-subtle)">No hay cursos que coincidan.</p>;
  }

  return (
    <div className="grid grid-cols-3 gap-4 content-start">
      {courses.map((course, i) => (
        <CourseLibCard
          key={course.id}
          course={course}
          index={i}
          onClick={() => onCourseClick(course.id)}
        />
      ))}
      {isTeacher && (
        <button
          type="button"
          onClick={onCreateCourse}
          className="group flex flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-(--border) bg-white/40 text-(--fg-muted) hover:border-emerald-400 hover:bg-white hover:text-emerald-700 transition min-h-[280px] p-6"
        >
          <div className="size-14 rounded-2xl bg-emerald-100 text-emerald-700 grid place-items-center group-hover:bg-emerald-200">
            <Plus className="size-6" />
          </div>
          <div className="text-base font-extrabold">Crear curso</div>
          <p className="text-xs text-center max-w-45 leading-snug">
            Configura nombre, fechas, visibilidad y portada.
          </p>
        </button>
      )}
    </div>
  );
};

export default CoursesGrid;
