import { createRoute } from '@tanstack/react-router';
import { layoutRoute } from './layout.route';
import CreateCoursePage from '@/features/courses/pages/CreateCoursePage';

export const createCourseRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/courses/new',
  component: CreateCoursePage,
});