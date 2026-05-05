import { createRoute } from '@tanstack/react-router';
import { layoutRoute } from './layout.route';
import CreateCourse from '@/features/courses/CreateCourse';

export const createCourseRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/courses/new',
  component: CreateCourse,
});