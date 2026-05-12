import type { CourseSection } from '@/modules/course/domain/CourseSection';
import type { TeacherStatsData } from '../../view-models/types';

export function getAvgProgress(sections: CourseSection[], teacherStats: TeacherStatsData) {
  const filtered = sections.filter((s) => s.id !== 0);
  if (!filtered.length) return 0;
  return Math.round(filtered.reduce((acc, s) => acc + (teacherStats.sectionProgress[s.id] ?? 0), 0) / filtered.length);
}
