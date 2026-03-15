import { ChevronRight } from "lucide-react";
import { SectionHeader } from "@/components/sectionHeader/SectionHeader";
import { IconButton } from "@/components/button/IconButton";
import { CourseCard } from "./CourseCard";
import type { Course } from "@/modules/course/domain/Course";

const COURSE_GRADIENTS = [
  "from-[var(--course-green-from)] to-[var(--course-emerald-to)]",
  "from-[var(--course-rose-from)] to-[var(--course-red-to)]",
  "from-[var(--course-blue-from)] to-[var(--course-indigo-to)]",
  "from-[var(--course-teal-from)] to-[var(--course-teal-to)]",
  "from-[var(--course-lime-from)] to-[var(--course-lime-to)]",
  "from-[var(--course-yellow-from)] to-[var(--course-yellow-to)]",
  "from-[var(--course-purple-from)] to-[var(--course-violet-to)]",
  "from-[var(--course-rose-from)] to-[var(--course-pink-to)]",
  "from-[var(--course-cyan-from)] to-[var(--course-sky-to)]",
  "from-[var(--course-orange-from)] to-[var(--course-orange-to)]",
];

export type CoursesProps = {
  courses: Course[];
  onCourseClick?: (courseId: string) => void;
  onViewAll?: () => void;
};

export const Courses = ({
  courses,
  onCourseClick,
  onViewAll,
}: CoursesProps) => (
  <section className="flex flex-col gap-4">
    <SectionHeader
      title="Mis Cursos"
      action={
        <IconButton
          icon={ChevronRight}
          label="Ver todos los cursos"
          onClick={onViewAll}
        />
      }
    />

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
