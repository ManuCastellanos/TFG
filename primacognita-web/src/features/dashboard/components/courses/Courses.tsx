import { ChevronRight } from "lucide-react";
import { SectionHeader } from "@/components/sectionHeader/SectionHeader";
import { IconButton } from "@/components/button/IconButton";
import { CourseCard } from "./CourseCard";
import type { Course } from "@/modules/course/domain/Course";

const COURSE_GRADIENTS = [
  "from-[var(--course-blue-from)] to-[var(--course-cyan-to)]",
  "from-[var(--course-violet-from)] to-[var(--course-purple-to)]",
  "from-[var(--course-emerald-from)] to-[var(--course-teal-to)]",
  "from-[var(--course-orange-from)] to-[var(--course-red-to)]",
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