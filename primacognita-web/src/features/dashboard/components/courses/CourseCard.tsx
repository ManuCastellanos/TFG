import { cn } from "@/shared/utils/cn";
import { Surface } from "@/components/surface/Surface";
import type { Course } from "@/modules/course/domain/Course";

export type CourseCardProps = {
  course: Course;
  accentColor?: string;
  onClick?: () => void;
};

const ProgressBar = ({ value }: { value: number }) => (
  <div className="h-1.5 w-full overflow-hidden rounded-full bg-(--bg)">
    <div
      className="h-full rounded-full bg-(--color-pr) transition-all"
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    />
  </div>
);

export const CourseCard = ({
  course,
  accentColor = "bg-orange-400",
  onClick,
}: CourseCardProps) => {
  const progress = course.progress ?? 0;

  return (
    <Surface
      as="button"
      onClick={onClick}
      className={cn(
        "flex flex-col overflow-hidden text-left transition hover:shadow-md",
        "w-full p-0 focus-visible:outline-2 focus-visible:outline-(--color-pr)",
      )}
    >
      <div
        className={cn(
          "relative flex h-32 w-full items-center justify-center",
          accentColor,
        )}
      >
        {course.imageUrl ? (
          <img
            src={course.imageUrl}
            alt={course.fullname}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-2xl font-bold text-white/60">
            {course.shortname.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2 p-3">
        <p className="line-clamp-2 text-sm font-semibold text-(--fg)">
          {course.fullname}
        </p>
        <ProgressBar value={progress} />
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-(--fg-muted)">Completed</span>
          <span className="text-[11px] font-medium text-(--fg)">
            {progress}%
          </span>
        </div>
      </div>
    </Surface>
  );
};
