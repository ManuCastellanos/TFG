import type { Course } from '@/modules/course/domain/Course';
import type { CourseSection } from '@/modules/course/domain/CourseSection';

export function getBannerStats(course: Course | null, sections: CourseSection[]) {
  const total = sections.reduce((t, s) => t + s.modules.length, 0);
  const progress = course?.progress ?? 0;
  return {
    bannerProgress: progress,
    bannerTotal: total,
    bannerDone: Math.round((progress / 100) * total),
  };
}
