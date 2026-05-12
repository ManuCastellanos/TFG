import { getCapabilities } from '../utils/workspace-capabilities';
import { filterTabs } from '../utils/workspace-tabs.utils';
import { enrichSections } from '../utils/sections/enrichSections';
import { getBannerStats } from '../utils/stats/getBannerStats';
import { getAvgProgress } from '../utils/stats/getAvgProgress';
import type { Course } from '@/modules/course/domain/Course';
import type { CourseSection } from '@/modules/course/domain/CourseSection';
import type { TeacherStatsData } from './types';
import type { CourseWorkspaceViewModel } from './types';

type Params = {
  roleName: string | null;
  course: Course | null;
  sections: CourseSection[];
  teacherStats: TeacherStatsData;
};

export function createCourseWorkspaceViewModel({
  roleName,
  course,
  sections,
  teacherStats,
}: Params): CourseWorkspaceViewModel {
  const caps = getCapabilities(roleName);
  const tabs = filterTabs(roleName);
  const enrichedSections = enrichSections(sections);
  const banner = getBannerStats(course, sections);
  const avgProgress = getAvgProgress(sections, teacherStats);

  return {
    caps,
    tabs,
    enrichedSections,
    bannerProgress: banner.bannerProgress,
    bannerTotal: banner.bannerTotal,
    bannerDone: banner.bannerDone,
    avgProgress,
  };
}
