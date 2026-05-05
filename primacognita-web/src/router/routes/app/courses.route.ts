import { createRoute } from '@tanstack/react-router';
import { layoutRoute } from './layout.route';
import Courses from '@/features/courses/Courses';

export const coursesRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/courses',
  component: Courses,
});