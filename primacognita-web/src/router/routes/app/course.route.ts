import { createRoute } from '@tanstack/react-router';
import { layoutRoute } from './layout.route';
import CoursePage from '@/features/course-workspace/pages/CourseWorkspacePage';
import { CourseWorkspacePageHeader } from '@/features/course-workspace/components/CourseWorkspacePageHeader';

export const courseRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/courses/$id',
  component: CoursePage,
  staticData: { header: CourseWorkspacePageHeader },
});
