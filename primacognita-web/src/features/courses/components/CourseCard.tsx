import { cn } from '@/shared/utils/cn';
import { Surface } from '@/components/ui/surface/Surface';
import { InlineProgressBar } from '@/components/ui/progressBar/ProgressBar';
import type { Course } from '@/modules/course/domain/Course';

export type CourseCardProps = {
  course: Course;
  gradient?: string;
  onClick?: () => void;
};

const CourseImage = ({ course }: { course: Course }) => {
  if (course.imageUrl) {
    return (
      <img
        src={course.imageUrl}
        alt={course.fullname}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
      />
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-white/95">
      <span className="text-4xl font-extrabold tracking-tight text-black/25">
        {course.shortname.slice(0, 2).toUpperCase()}
      </span>
    </div>
  );
};

export const CourseCard = ({
  course,
  gradient = 'from-[var(--course-blue-from)] to-[var(--course-blue-to)]',
  onClick,
}: CourseCardProps) => {
  const progress = course.progress ?? 0;

  return (
    <Surface
      as="button"
      onClick={onClick}
      className={cn(
        'group w-full overflow-hidden rounded-[1.6rem] p-0 text-left',
        'transition-all duration-200',
        'hover:-translate-y-0.5 hover:shadow-(--shadow-md)',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-strong)',
        'bg-linear-to-br',
        gradient,
      )}
    >
      <div className="flex flex-col gap-3 p-3">
        <div
          className="relative h-34 w-full overflow-hidden rounded-[1.15rem] bg-white"
          style={{ border: '2px solid rgba(255,255,255,0.75)' }}
        >
          <CourseImage course={course} />
        </div>

        <div className="flex flex-col gap-2 px-1 pb-1">
          <p className="line-clamp-2 text-shadow-md font-extrabold leading-tight text-white">{course.fullname}</p>

          <InlineProgressBar value={progress} trackClass="bg-white/35" colorClass="bg-white/90" />

          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-white/80">Completed:</span>
            <span className="text-[11px] font-bold text-white/95">{progress}%</span>
          </div>
        </div>
      </div>
    </Surface>
  );
};
