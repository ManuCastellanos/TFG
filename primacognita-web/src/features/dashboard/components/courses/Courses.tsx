import { ChevronRight } from "lucide-react";
import { SectionHeader } from "@/components/sectionHeader/SectionHeader";
import { IconButton } from "@/components/button/IconButton";
import { CourseCard } from "./CourseCard";
import type { Course } from "@/modules/course/domain/Course";

const ACCENT_COLORS = [
  "bg-orange-400",
  "bg-pink-400",
  "bg-blue-500",
  "bg-violet-400",
  "bg-teal-400",
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
      title="Your Courses"
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
          accentColor={ACCENT_COLORS[i % ACCENT_COLORS.length]}
          onClick={() => onCourseClick?.(course.id)}
        />
      ))}
    </div>
  </section>
);
