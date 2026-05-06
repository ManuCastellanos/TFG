import { createRoute } from '@tanstack/react-router';
import { layoutRoute } from './layout.route';
import CoursePage from '@/features/course-workspace/page/CourseWorkspacePage';

export const courseRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/courses/$id',
  component: CoursePage,
});
