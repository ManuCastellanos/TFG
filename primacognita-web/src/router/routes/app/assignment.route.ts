import { createRoute } from '@tanstack/react-router';
import { layoutRoute } from './layout.route';
import AssignmentPage from '@/features/assign/pages/AssignmentPage';
import { AssignmentPageHeader } from '@/features/assign/components/AssignmentPageHeader';

export const assignmentRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/courses/$courseId/assignment/$cmid',
  component: AssignmentPage,
  staticData: { header: AssignmentPageHeader },
});
