import { createRoute } from '@tanstack/react-router';
import { layoutRoute } from './layout.route';
import CoursePage from '@/features/courses/CoursePage';

export const courseRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/courses/$id',
  component: CoursePage,
});
