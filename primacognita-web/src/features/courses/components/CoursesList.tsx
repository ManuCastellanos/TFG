import { ChevronRight } from 'lucide-react';
import { SectionHeader } from '@/components/layout/sectionHeader/SectionHeader';
import { Button } from '@/components/ui/button/Button';
import { CourseCard } from './CourseCard';
import type { Course } from '@/modules/course/domain/Course';

const COURSE_GRADIENTS = [
  'from-[var(--course-green-from)] to-[var(--course-emerald-to)]',
  'from-[var(--course-rose-from)] to-[var(--course-red-to)]',
  'from-[var(--course-blue-from)] to-[var(--course-indigo-to)]',
  'from-[var(--course-teal-from)] to-[var(--course-teal-to)]',
  'from-[var(--course-lime-from)] to-[var(--course-lime-to)]',
  'from-[var(--course-yellow-from)] to-[var(--course-yellow-to)]',
  'from-[var(--course-purple-from)] to-[var(--course-violet-to)]',
  'from-[var(--course-rose-from)] to-[var(--course-pink-to)]',
  'from-[var(--course-cyan-from)] to-[var(--course-sky-to)]',
  'from-[var(--course-orange-from)] to-[var(--course-orange-to)]',
];

export type CourseProps = {
  courses: Course[];
  onCourseClick?: (courseId: string) => void;
  onViewAll?: () => void;
  showHeader?: boolean;
};

export const CoursesList = ({ courses, onCourseClick, onViewAll, showHeader = true }: CourseProps) => (
  <section className="flex flex-col gap-6">
    {showHeader && (
      <SectionHeader
        title="Mis Cursos"
        action={
          onViewAll ? (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Ver todos los cursos"
              onClick={onViewAll}
              className="size-auto p-1.5 rounded-md"
            >
              <ChevronRight className="size-5" />
            </Button>
          ) : undefined
        }
      />
    )}

    <div className="grid grid-cols-3 gap-4">
      {courses.map((course, i) => (
        <CourseCard
          key={course.id}
          course={course}
          gradient={COURSE_GRADIENTS[i % COURSE_GRADIENTS.length]}
          onClick={() => onCourseClick?.(course.id)}
        />
      ))}
    </div>
  </section>
);
