import { createRoute } from '@tanstack/react-router';
import { layoutRoute } from './layout.route';
import Courses from '@/features/courses/pages/CoursesPage';
import { CoursesPageHeader } from '@/features/courses/components/CoursesPageHeader';

export const coursesRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/courses',
  component: Courses,
  staticData: { header: CoursesPageHeader },
});