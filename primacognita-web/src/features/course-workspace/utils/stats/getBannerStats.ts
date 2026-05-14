import type { Course } from '@/modules/course/domain/Course';
import type { CourseSection } from '@/modules/course/domain/CourseSection';

export function getBannerStats(_course: Course | null, sections: CourseSection[]) {
  const tracked = sections.flatMap((s) => s.modules.filter((m) => m.completion?.hasCompletion));
  const done = tracked.filter((m) => (m.completion?.state ?? 0) >= 1).length;
  const total = tracked.length;

  return {
    bannerProgress: total > 0 ? Math.round((done / total) * 100) : 0,
    bannerTotal: total,
    bannerDone: done,
  };
}
