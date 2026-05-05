import { cn } from '@/shared/utils/cn';
import { Surface } from '@/components/surface/Surface';
import type { Course } from '@/modules/course/domain/Course';

export type CourseCardProps = {
  course: Course;
  gradient?: string;
  onClick?: () => void;
};

const clampProgress = (value: number) => Math.min(100, Math.max(0, value));

const ProgressBar = ({ value }: { value: number }) => (
  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/35">
    <div
      className="h-full rounded-full transition-all"
      style={{
        width: `${clampProgress(value)}%`,
        backgroundColor: 'rgba(255,255,255,0.92)',
      }}
    />
  </div>
);

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
          {course.imageUrl ? (
            <img
              src={course.imageUrl}
              alt={course.fullname}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-white/95">
              <span className="text-4xl font-extrabold tracking-tight text-black/25">
                {course.shortname.slice(0, 2).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 px-1 pb-1">
          <p className="line-clamp-2 text-shadow-md font-extrabold leading-tight text-white">{course.fullname}</p>

          <ProgressBar value={progress} />

          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-white/80">Completed:</span>
            <span className="text-[11px] font-bold text-white/95">{progress}%</span>
          </div>
        </div>
      </div>
    </Surface>
  );
};
