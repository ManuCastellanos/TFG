import type { Course } from '@/modules/course/domain/Course';
import type { CourseSection } from '@/modules/course/domain/CourseSection';
import { COLOR_META, type CourseColor } from '@/shared/hooks/useCourseCustomization';

type CourseBannerProps = {
  course: Course;
  sections: CourseSection[];
  color: CourseColor;
};

const CourseBanner = ({ course, sections, color }: CourseBannerProps) => {
  const progress = course.progress ?? 0;

  const totalActivities = sections.reduce((total, section) => total + section.modules.length, 0);

  const completedActivities = Math.round((progress / 100) * totalActivities);

  const colorMeta = COLOR_META[color];

  const hasActivities = totalActivities > 0;

  const progressDescription = hasActivities
    ? `${completedActivities} de ${totalActivities} actividades`
    : course.completed
      ? '¡Completado! 🎉'
      : null;

  const bannerClasses = `
    relative
    rounded-3xl
    p-6
    mb-6
    border
    overflow-hidden
    ${colorMeta.border}
    ${colorMeta.softBanner}
  `;

  return (
    <div className={bannerClasses}>
      <div
        className={`
          absolute
          top-0
          -right-8
          size-48
          rounded-full
          opacity-30
          blur-2xl
          ${colorMeta.glow}
        `}
      />

      <div className="relative">
        <div className="text-xs font-extrabold uppercase tracking-wider text-(--fg) mb-2">
          Tu progreso del trimestre
        </div>

        <div className="flex items-baseline gap-2 mb-3">
          <span className={`text-4xl font-extrabold ${colorMeta.text}`}>{progress}%</span>

          {progressDescription && (
            <span
              className={`
                text-sm
                font-extrabold
                ${colorMeta.text}
                opacity-70
              `}
            >
              · {progressDescription}
            </span>
          )}
        </div>

        <div className="h-3 rounded-full bg-white/60">
          <div
            className={`
              h-full
              rounded-full
              bg-linear-to-r
              ${colorMeta.grad}
              transition-all
            `}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default CourseBanner;
