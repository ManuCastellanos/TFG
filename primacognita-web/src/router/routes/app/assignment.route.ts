import { createRoute } from '@tanstack/react-router';
import { layoutRoute } from './layout.route';
import AssignmentPage from '@/features/assign/pages/AssignmentPage';

export const assignmentRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/courses/$courseId/assignment/$cmid',
  component: AssignmentPage,
});
